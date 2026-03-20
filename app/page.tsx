'use client';

import { useState, useMemo, JSX, lazy } from "react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "../components/ui/button";
// Lazy load Card components to reduce initial bundle
const Card = lazy( () => import( "@/components/ui/card" ).then( mod => ( { default: mod.Card } ) ) );
const CardHeader = lazy( () => import( "@/components/ui/card" ).then( mod => ( { default: mod.CardHeader } ) ) );
const CardContent = lazy( () => import( "@/components/ui/card" ).then( mod => ( { default: mod.CardContent } ) ) );
const CardTitle = lazy( () => import( "@/components/ui/card" ).then( mod => ( { default: mod.CardTitle } ) ) );

const EXAMPLE_SETS = ['names', 'emails', 'urls', 'phone', 'dates', 'ipv4', 'words', 'digits'] as const;
type ExampleType = typeof EXAMPLE_SETS[number];

function capitalizeFirstLetter( str: string )
{
  if ( typeof str !== 'string' || str.length === 0 ) {
    return str; // Handle empty strings or non-string inputs
  }
  return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

export default function RegexPreview()
{
  const [pattern, setPattern] = useState( "" );
  const [replaceValue, setReplaceValue] = useState( "" );
  const [text, setText] = useState( "" );
  const [enableReplace, setEnableReplace] = useState( false );
  const [copiedPattern, setCopiedPattern] = useState( false );
  const [copiedLiteral, setCopiedLiteral] = useState( false );

  const [flagI, setFlagI] = useState( false );
  const [flagM, setFlagM] = useState( false );
  const [flagS, setFlagS] = useState( false );

  const flags = `g${ flagI ? "i" : "" }${ flagM ? "m" : "" }${ flagS ? "s" : "" }`;

  // Lazy-load example sets dynamically
  const loadExampleSet = async ( type: ExampleType ) =>
  {
    if ( !type ) return
    const module = await import( `../data/example-${ type }` );
    setText( module.default );
  };

  let regexError: string | null = null;
  const regex = useMemo( () =>
  {
    try {
      return pattern ? new RegExp( pattern, flags ) : null;
    } catch ( err: any ) {
      regexError = err.message;
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags] );


  const handleCopy = async ( text: string, type: "pattern" | "literal" ) =>
  {
    await navigator.clipboard.writeText( text );

    if ( type === "literal" ) {
      setCopiedLiteral( true );
      setTimeout( () => setCopiedLiteral( false ), 1200 );
    } else {
      setCopiedPattern( true );
      setTimeout( () => setCopiedPattern( false ), 1200 );
    }
  };

  // highlight
  const highlightMatches = ( input: string ) =>
  {
    if ( !regex ) return input;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    input.replace( regex, ( match, ...args ) =>
    {
      const offset = args[args.length - 2];
      parts.push( <span key={`t-${ offset }`}>{input.slice( lastIndex, offset )}</span> );
      parts.push(
        <span
          key={`m-${ offset }`}
          className="bg-yellow-400 text-black font-semibold px-1 text-wrap! word-break rounded-lg"
        >
          {match}
        </span>
      );
      lastIndex = offset + match.length;
      return match;
    } );

    if ( lastIndex < input.length ) {
      parts.push( <span key={`e-${ lastIndex }`} className="text-wrap! word-break">{input.slice( lastIndex )}</span> );
    }

    return parts;
  };

  const expandReplacement = (
    template: string,
    match: string,
    groups: RegExpExecArray,
    offset: number,
    input: string
  ) =>
  {
    return template.replace( /\$([$&`']|\d{1,2})/g, ( _m, p: string ) =>
    {
      if ( p === "$" ) return "$";
      if ( p === "&" ) return match;
      if ( p === "`" ) return input.slice( 0, offset );
      if ( p === "'" ) return input.slice( offset + match.length );
      const n = Number( p );
      if ( !Number.isNaN( n ) && n >= 1 && n < groups.length ) return groups[n] ?? "";
      return _m; // leave unknown sequences as-is
    } );
  };

  const highlightReplaced = ( input: string ) =>
  {
    if ( !regex || !replaceValue ) return input;

    const parts: JSX.Element[] = [];
    let lastPos = 0;
    const r = new RegExp( regex.source, regex.flags ); // clone to control lastIndex

    for ( ; ; ) {
      const m = r.exec( input );
      if ( !m ) break;

      // guard zero-length matches to avoid infinite loop
      if ( m[0] === "" ) {
        r.lastIndex += 1;
        continue;
      }

      const before = input.slice( lastPos, m.index );
      parts.push( <span key={`rb-${ lastPos }`} className="text-wrap! word-break">{before}</span> );
      const replacement = expandReplacement( replaceValue, m[0], m as RegExpExecArray, m.index, input );

      parts.push(
        <span
          key={`rh-${ m.index }`}
          className="bg-amber-400 text-black font-semibold px-1 rounded-lg text-wrap! word-break"
        >
          {replacement}
        </span>
      );

      lastPos = m.index + m[0].length;
    }

    if ( lastPos < input.length ) {
      parts.push( <span key={`re-${ lastPos }`}>{input.slice( lastPos )}</span> );
    }

    return parts;
  };

  // compute capture groups count for UI helper
  const captureGroups = useMemo( () =>
  {
    if ( !regex ) return 0;
    const source = regex.source;
    const groups = source.match( /\((?!\?)/g );
    return groups ? groups.length : 0;
  }, [regex] );

  const highlighted = useMemo( () => highlightMatches( text ), [text, regex] );
  const replaced = useMemo( () => enableReplace ? highlightReplaced( text ) : text, [text, regex, replaceValue] );


  return (
    <div className="w-screen h-screen flex justify-center items-center align-center">
      <div className="w-full h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center py-10 px-4">

        <Card className="w-full max-w-2xl bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">Regex Tool</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* pattern */}
            <div className="space-y-1">
              {/* Presets */}
              <div className="space-x-5 grid grid-cols-2 items-center">
                <div className=" space-y-2">
                  <Label className="text-neutral-300">Presets</Label>

                  <select
                    className=" bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-md p-2 text-sm w-full"
                    onChange={( e ) =>
                    {
                      const v = e.target.value;
                      if ( !v ) return;

                      const presets: Record<string, string> = {
                        email: `^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$`,
                        url: `https?:\\/\\/(www\\.)?[\\w.-]+\\.[A-Za-z]{2,}.*`,
                        phone: `\\+?\\d[\\d\\s-]{7,}\\d`,
                        date: `\\b\\d{4}-\\d{2}-\\d{2}\\b`,
                        ipv4: `\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b`,
                        words: `\\b\\w+\\b`,
                        digits: `\\d+`,
                      };

                      setPattern( presets[v] ?? "" );
                    }}
                    defaultValue=""
                  >
                    <option value="">Select preset…</option>
                    <option value="email">Email</option>
                    <option value="url">URL</option>
                    <option value="phone">Phone</option>
                    <option value="date">Date (YYYY-MM-DD)</option>
                    <option value="ipv4">IPv4</option>
                    <option value="words">Words</option>
                    <option value="digits">Digits</option>
                  </select>
                </div>
                {/* Example input sets */}
                <div className="space-y-2">
                  <Label className="text-neutral-300">Data</Label>
                  <select className="bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-md p-2 text-sm w-full"
                    onChange={e => loadExampleSet( e.target.value as ExampleType )} defaultValue="">
                    <option value="">Select Data…</option>
                    {EXAMPLE_SETS.map( s => <option key={s} value={s}>{capitalizeFirstLetter( s )}</option> )}
                  </select>
                </div>
              </div>
              <Label className="text-neutral-300 flex items-center justify-between">
                Regex Pattern

                <div className="flex items-center gap-2 h-[26px] mt-2 mb-1">

                  {/* Display regex literal */}
                  {pattern && (
                    <>
                      <div className="mt-1 text-xs font-mono text-neutral-400">
                        /{pattern}/{flags}
                      </div>

                      <Button
                        onClick={() => handleCopy( `/${ pattern }/${ flags }`, "literal" )}
                        size="sm"
                        className={copiedLiteral ? "bg-green-600 text-white" : ""}
                      >
                        {copiedLiteral ? "Copied!" : "Copy /pattern/flags"}
                      </Button>

                      <Button
                        onClick={() => handleCopy( pattern, "pattern" )}
                        size="sm"
                        className={copiedPattern ? "bg-green-600 text-white" : ""}
                      >
                        {copiedPattern ? "Copied!" : "Copy Pattern"}
                      </Button></>
                  )}
                </div>
              </Label>


              <div className="flex gap-2 items-start">
                <Input
                  placeholder="e.g. ^foo(.*)bar$"
                  value={pattern}
                  onChange={( e ) => setPattern( e.target.value )}
                  className="bg-neutral-800 border-neutral-700 text-neutral-200"
                />

                {/* Cheat sheet popover */}
                <div className="relative">
                  <button
                    className="px-2 py-1 text-xs rounded bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                    onClick={() =>
                    {
                      const el = document.getElementById( "regex-cheat" );
                      if ( !el ) return;
                      el.classList.toggle( "hidden" );
                    }}
                  >
                    ?
                  </button>

                  <div
                    id="regex-cheat"
                    className="hidden absolute right-0 mt-2 w-72 p-4 bg-neutral-900 border border-neutral-700 rounded shadow-lg text-xs z-50"
                  >
                    <div className="font-semibold text-neutral-100 mb-2">
                      Regex Cheat Sheet
                    </div>

                    <div className="grid grid-cols-3 gap-x-1 gap-y-1 text-neutral-300">

                      <span className="text-indigo-400 font-mono">.</span>
                      <span className="col-span-2">any character</span>

                      <span className="text-indigo-400 font-mono">\d</span>
                      <span className="col-span-2">digit</span>

                      <span className="text-indigo-400 font-mono">\w</span>
                      <span className="col-span-2">word char</span>

                      <span className="text-indigo-400 font-mono">\b</span>
                      <span className="col-span-2">word boundary, used with \w</span>

                      <span className="text-indigo-400 font-mono">\s</span>
                      <span className="col-span-2">whitespace</span>

                      <span className="text-indigo-400 font-mono">^</span>
                      <span className="col-span-2">start</span>

                      <span className="text-indigo-400 font-mono">$</span>
                      <span className="col-span-2">end</span>

                      <span className="text-indigo-400 font-mono">[abc]</span>
                      <span className="col-span-2">char set</span>

                      <span className="text-indigo-400 font-mono">( )</span>
                      <span className="col-span-2">capture group</span>

                      <span className="text-indigo-400 font-mono">|</span>
                      <span className="col-span-2">OR</span>

                      <span className="text-indigo-400 font-mono">*</span>
                      <span className="col-span-2">0+ times</span>

                      <span className="text-indigo-400 font-mono">+</span>
                      <span className="col-span-2">1+ times</span>

                      <span className="text-indigo-400 font-mono">?</span>
                      <span className="col-span-2">optional</span>
                    </div>

                    <div className="border-t border-neutral-700 my-2" />

                    <div className="font-semibold text-neutral-200 mb-1">Flags</div>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-neutral-400">
                      <span className="text-indigo-400 font-mono">i</span>
                      <span className="col-span-2">ignore case</span>

                      <span className="text-indigo-400 font-mono">m</span>
                      <span className="col-span-2">multi-line ^$</span>

                      <span className="text-indigo-400 font-mono">s</span>
                      <span className="col-span-2">dot matches newline</span>

                      <span className="text-indigo-400 font-mono">g</span>
                      <span className="col-span-2">global</span>
                    </div>
                  </div>
                </div>

              </div>

              {regexError && <div className="text-red-400 text-xs mt-1">{regexError}</div>}
            </div>

            <Separator className="bg-neutral-800" />

            {/* flags */}
            <div className="flex flex-wrap gap-4 text-sm">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={enableReplace} onCheckedChange={() => setEnableReplace( x => !x )} />
                <span className="text-neutral-400">Replace</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={flagI} onCheckedChange={() => setFlagI( x => !x )} /> i
                <span className="text-neutral-400">(ignore case)</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={flagM} onCheckedChange={() => setFlagM( x => !x )} /> m
                <span className="text-neutral-400">(multi-line)</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={flagS} onCheckedChange={() => setFlagS( x => !x )} /> s
                <span className="text-neutral-400">(dot matches newline)</span>
              </Label>
            </div>

            {enableReplace && (
              <div className="space-y-1">
                <Label className="text-neutral-300">Replace With</Label>
                <Input
                  placeholder="Use $1, $2 for groups"
                  value={replaceValue}
                  onChange={e => setReplaceValue( e.target.value )}
                  className="bg-neutral-800 border-neutral-700 text-neutral-200"
                />

                {captureGroups > 0 && (
                  <div className="text-xs text-neutral-400 mt-1">
                    Groups detected: {Array.from( { length: captureGroups } ).map( ( _, i ) => (
                      <span key={i} className="mr-2">$ {i + 1}</span>
                    ) )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* text + highlight + replaced */}
        <div className={cn(
          "w-full max-w-4xl grid gap-6 mt-8 text-wrap! word-break",
          enableReplace ? "md:grid-cols-2" : "md:grid-cols-1"
        )}>

          {/* overlay input */}
          <div>
            <Label className="text-lg font-semibold mb-2 block">Input Text</Label>
            <div className="relative w-full">
              <pre
                id="highlight-layer"
                className="absolute top-0 left-0 w-full h-64 p-3 rounded-md font-mono overflow-auto pointer-events-none bg-neutral-800 border border-neutral-700 text-neutral-200 whitespace-pre-wrap break-words"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", zIndex: 1 }}
              >
                {highlighted}
              </pre>

              <textarea
                value={text}
                onChange={( e ) => setText( e.target.value )}
                className="absolute top-0 left-0 w-full h-64 p-3 rounded-md bg-transparent text-transparent caret-white border border-neutral-700 resize-none overflow-auto font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-wrap! word-break"
                style={{ zIndex: 2 }}
                onScroll={( e ) =>
                {
                  const layer = document.getElementById( "highlight-layer" );
                  if ( !layer ) return;
                  const t = e.target as HTMLTextAreaElement;
                  layer.scrollTop = t.scrollTop;
                  layer.scrollLeft = t.scrollLeft;
                }}
              />
            </div>
          </div>

          {enableReplace && (
            <div>
              <Label className="text-lg font-semibold mb-2 block">Replaced Output</Label>
              <Card className="h-64 bg-[var(--surface)] border-[var(--blue-muted)] p-3 overflow-auto whitespace-pre-wrap font-mono text-[var(--foreground)]">
                <pre
                  id="highlight-layer text-wrap! whitespace-pre-wrap break-words"
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", zIndex: 1 }}
                >
                  {replaced}</pre>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
