import React, { useState, useEffect } from "react";
import { Play, Code, Sparkles, Copy, Check, Mic, MicOff, Volume2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import toast, { Toaster } from "react-hot-toast";
import useAiPrompt from "../hooks/useAiPrompt";
import useSpeechToText from "../hooks/useSpeechToText";

const AIPromptPage = () => {
  const [inputCode, setInputCode] = useState("");
  const [response, setResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("javascript");
  const [validationError, setValidationError] = useState(null);
  const [suggestedLanguage, setSuggestedLanguage] = useState(null);
  const { isPending, error, aiMutation } = useAiPrompt(setResponse);
  
  // Speech-to-text hook
  const {
    isListening,
    transcript,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "markdown", label: "Markdown" },
  ];

  const themes = [
    { value: "vs-dark", label: "VS Dark" },
    { value: "vs-light", label: "VS Light" },
    { value: "hc-black", label: "High Contrast Black" },
    { value: "github-light", label: "GitHub Light" },
    { value: "github-dark", label: "GitHub Dark" },
    { value: "dracula", label: "Dracula" },
    { value: "nord", label: "Nord" },
    { value: "oceanic-next", label: "Oceanic Next" },
    { value: "solarized-light", label: "Solarized Light" },
    { value: "solarized-dark", label: "Solarized Dark" },
    { value: "galaxy-dark", label: "Galaxy Dark" },
  ];

  // Update input code when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setInputCode(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const validateInput = (code, selectedLanguage) => {
    if (!code.trim()) {
      return { isValid: false, message: "Input code cannot be empty." };
    }

    const patterns = {
      javascript: /(function\s+\w+\s*\(|\bconst\b|\blet\b|\bvar\b|\breturn\b|console\.log)/,
      python: /(def\s+\w+\s*\(|\bprint\(|^import\s+\w+)/,
      typescript: /(function\s+\w+\s*\(.*?\):\s*\w+|\binterface\b|\btype\b|\bpublic\b|\bprivate\b)/,
      java: /(public\s+class\s+\w+|\bvoid\s+\w+\s*\(|\bint\s+\w+)/,
      cpp: /(int\s+main\s*\(|\b#include\s+<\w+>|\bcout\b)/,
      html: /(<\w+\s*.*?>)|(<\/\w+>)|(<!DOCTYPE\s+html>)/,
      css: /(\w+\s*\{\s*\w+:\s*[^;]+;)/,
      json: /^[\s\n]*\{[\s\S]*\}[\s\n]*$|^[\s\n]*\[[\s\S]*\][\s\n]*$/,
      xml: /(<\?xml\s+version=.*?\?>|<[a-zA-Z][\w:.-]*>.*<\/[a-zA-Z][\w:.-]*>)/,
      markdown: /^(\#|\*|\-|\d+\.|\`{3})/,
    };

    if (patterns[selectedLanguage]?.test(code)) {
      return { isValid: true };
    }

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        return {
          isValid: false,
          message: `This code appears to be ${lang} but ${selectedLanguage} is selected.`,
          suggestedLanguage: lang,
        };
      }
    }

    return {
      isValid: false,
      message: `Invalid ${selectedLanguage} syntax. Please check your code.`,
    };
  };

  useEffect(() => {
    if (response) {
      let i = 0;
      setDisplayedResponse("");
      const typeInterval = setInterval(() => {
        if (i < response.length) {
          setDisplayedResponse((prev) => prev + response[i]);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 20);
      return () => clearInterval(typeInterval);
    }
  }, [response]);

  useEffect(() => {
    if (validationError) {
      toast.error(validationError, {
        duration: 5000,
        position: "top-right",
      });
    }
  }, [validationError]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`, {
        duration: 5000,
        position: "top-right",
      });
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateInput(inputCode, language);
    if (!validation.isValid) {
      setValidationError(validation.message);
      setSuggestedLanguage(validation.suggestedLanguage || null);
      return;
    }
    setValidationError(null);
    setSuggestedLanguage(null);
    if (inputCode.trim()) {
      aiMutation(inputCode);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayedResponse);
      setCopied(true);
      toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "bottom-center",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy!", {
        duration: 2000,
        position: "bottom-center",
      });
    }
  };

  const handleSpeechToggle = () => {
    if (isListening) {
      stopListening();
      toast.success("Voice recording stopped", {
        duration: 2000,
        position: "bottom-center",
      });
    } else {
      if (!speechSupported) {
        toast.error("Speech recognition is not supported in your browser", {
          duration: 3000,
          position: "bottom-center",
        });
        return;
      }
      startListening();
      toast.success("Voice recording started - speak now!", {
        duration: 2000,
        position: "bottom-center",
      });
    }
  };

  const clearInputCode = () => {
    setInputCode("");
    toast.success("Input cleared", {
      duration: 1500,
      position: "bottom-center",
    });
  };

  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme("github-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#6A737D" },
        { token: "keyword", foreground: "#D73A49" },
        { token: "string", foreground: "#032F62" },
        { token: "number", foreground: "#005CC5" },
        { token: "identifier", foreground: "#6F42C1" },
        { token: "function", foreground: "#6F42C1" },
        { token: "operator", foreground: "#D73A49" },
        { token: "delimiter", foreground: "#24292E" },
      ],
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#24292E",
        "editorLineNumber.foreground": "#6A737D",
        "editorLineNumber.activeForeground": "#24292E",
        "editor.selectionBackground": "#B3D4FF",
        "editor.selectionForeground": "#000000",
        "editorCursor.foreground": "#24292E",
        "editor.lineHighlightBackground": "#F6F8FA",
        "editorIndentGuide.background": "#E1E4E8",
        "editorIndentGuide.activeBackground": "#D1D5DA",
      },
    });

    monaco.editor.defineTheme("github-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#8B949E" },
        { token: "keyword", foreground: "#FF7B72" },
        { token: "string", foreground: "#A5D6FF" },
        { token: "number", foreground: "#79C0FF" },
        { token: "identifier", foreground: "#D2A8FF" },
        { token: "function", foreground: "#D2A8FF" },
        { token: "operator", foreground: "#FF7B72" },
        { token: "delimiter", foreground: "#C9D1D9" },
      ],
      colors: {
        "editor.background": "#0D1117",
        "editor.foreground": "#C9D1D9",
        "editorLineNumber.foreground": "#484F58",
        "editorLineNumber.activeForeground": "#C9D1D9",
        "editor.selectionBackground": "#003D73",
        "editor.selectionForeground": "#FFFFFF",
        "editorCursor.foreground": "#C9D1D9",
        "editor.lineHighlightBackground": "#161B22",
        "editorIndentGuide.background": "#30363D",
        "editorIndentGuide.activeBackground": "#484F58",
      },
    });

    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#6272A4" },
        { token: "keyword", foreground: "#FF79C6" },
        { token: "string", foreground: "#F1FA8C" },
        { token: "number", foreground: "#BD93F9" },
        { token: "identifier", foreground: "#50FA7B" },
        { token: "function", foreground: "#50FA7B" },
        { token: "operator", foreground: "#FF79C6" },
        { token: "delimiter", foreground: "#F8F8F2" },
      ],
      colors: {
        "editor.background": "#282A36",
        "editor.foreground": "#F8F8F2",
        "editorLineNumber.foreground": "#6272A4",
        "editorLineNumber.activeForeground": "#F8F8F2",
        "editor.selectionBackground": "#44475A",
        "editor.selectionForeground": "#F8F8F2",
        "editorCursor.foreground": "#F8F8F2",
        "editor.lineHighlightBackground": "#44475A",
        "editorIndentGuide.background": "#343746",
        "editorIndentGuide.activeBackground": "#44475A",
      },
    });

    monaco.editor.defineTheme("nord", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#616E88" },
        { token: "keyword", foreground: "#81A1C1" },
        { token: "string", foreground: "#A3BE8C" },
        { token: "number", foreground: "#B48EAD" },
        { token: "identifier", foreground: "#88C0D0" },
        { token: "function", foreground: "#88C0D0" },
        { token: "operator", foreground: "#81A1C1" },
        { token: "delimiter", foreground: "#D8DEE9" },
      ],
      colors: {
        "editor.background": "#2E3440",
        "editor.foreground": "#D8DEE9",
        "editorLineNumber.foreground": "#4C566A",
        "editorLineNumber.activeForeground": "#D8DEE9",
        "editor.selectionBackground": "#434C5E",
        "editor.selectionForeground": "#D8DEE9",
        "editorCursor.foreground": "#D8DEE9",
        "editor.lineHighlightBackground": "#3B4252",
        "editorIndentGuide.background": "#4C566A",
        "editorIndentGuide.activeBackground": "#616E88",
      },
    });

    monaco.editor.defineTheme("oceanic-next", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#65737E" },
        { token: "keyword", foreground: "#C792EA" },
        { token: "string", foreground: "#2EC4B6" },
        { token: "number", foreground: "#F78C6C" },
        { token: "identifier", foreground: "#C594C5" },
        { token: "function", foreground: "#F78C6C" },
        { token: "operator", foreground: "#89DDFF" },
        { token: "delimiter", foreground: "#CDD3DE" },
      ],
      colors: {
        "editor.background": "#1B2B34",
        "editor.foreground": "#CDD3DE",
        "editorLineNumber.foreground": "#4F5B66",
        "editorLineNumber.activeForeground": "#CDD3DE",
        "editor.selectionBackground": "#343D46",
        "editor.selectionForeground": "#CDD3DE",
        "editorCursor.foreground": "#CDD3DE",
        "editor.lineHighlightBackground": "#2C3B43",
        "editorIndentGuide.background": "#343D46",
        "editorIndentGuide.activeBackground": "#4F5B66",
      },
    });

    monaco.editor.defineTheme("solarized-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#93A1A1" },
        { token: "keyword", foreground: "#859900" },
        { token: "string", foreground: "#2AA198" },
        { token: "number", foreground: "#D33682" },
        { token: "identifier", foreground: "#268BD2" },
        { token: "function", foreground: "#B58900" },
        { token: "operator", foreground: "#657B83" },
        { token: "delimiter", foreground: "#657B83" },
      ],
      colors: {
        "editor.background": "#FDF6E3",
        "editor.foreground": "#657B83",
        "editorLineNumber.foreground": "#93A1A1",
        "editorLineNumber.activeForeground": "#657B83",
        "editor.selectionBackground": "#EEE8D5",
        "editor.selectionForeground": "#000000",
        "editorCursor.foreground": "#657B83",
        "editor.lineHighlightBackground": "#FDF6E3",
        "editorIndentGuide.background": "#93A1A1",
        "editorIndentGuide.activeBackground": "#586E75",
      },
    });

    monaco.editor.defineTheme("solarized-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#586E75" },
        { token: "keyword", foreground: "#859900" },
        { token: "string", foreground: "#2AA198" },
        { token: "number", foreground: "#D33682" },
        { token: "identifier", foreground: "#268BD2" },
        { token: "function", foreground: "#B58900" },
        { token: "operator", foreground: "#839496" },
        { token: "delimiter", foreground: "#839496" },
      ],
      colors: {
        "editor.background": "#002B36",
        "editor.foreground": "#839496",
        "editorLineNumber.foreground": "#586E75",
        "editorLineNumber.activeForeground": "#839496",
        "editor.selectionBackground": "#073642",
        "editor.selectionForeground": "#FFFFFF",
        "editorCursor.foreground": "#839496",
        "editor.lineHighlightBackground": "#073642",
        "editorIndentGuide.background": "#586E75",
        "editorIndentGuide.activeBackground": "#657B83",
      },
    });

    monaco.editor.defineTheme("galaxy-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "#6C7A89" },
        { token: "keyword", foreground: "#A366FF" },
        { token: "string", foreground: "#4ECDC4" },
        { token: "number", foreground: "#FFD166" },
        { token: "identifier", foreground: "#BB86FC" },
        { token: "function", foreground: "#00BFFF" },
        { token: "operator", foreground: "#FF6B6B" },
        { token: "delimiter", foreground: "#E0E0E0" },
      ],
      colors: {
        "editor.background": "#1A1A2E",
        "editor.foreground": "#E0E0E0",
        "editorLineNumber.foreground": "#5A677C",
        "editorLineNumber.activeForeground": "#E0E0E0",
        "editor.selectionBackground": "#3B3B54",
        "editor.selectionForeground": "#FFFFFF",
        "editorCursor.foreground": "#E0E0E0",
        "editor.lineHighlightBackground": "#2C2C42",
        "editorIndentGuide.background": "#4A4A60",
        "editorIndentGuide.activeBackground": "#6C7A89",
      },
    });

    monaco.editor.setTheme(theme);
  };

  const switchLanguage = () => {
    if (suggestedLanguage) {
      setLanguage(suggestedLanguage);
      setValidationError(null);
      setSuggestedLanguage(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-[#D4D4D4] font-mono text-sm">
      <Toaster position="center"/>
      <div className="w-12 bg-[#252526] flex flex-col items-center py-4 border-r border-[#3C3C3C]">
        <div className="p-2 rounded text-[#9CDCFE] bg-[#333333] mb-2">
          <Code size={20} />
        </div>
        <div className="p-2 rounded text-[#808080] hover:text-[#D4D4D4] transition-colors cursor-pointer">
          <Sparkles size={20} />
        </div>
        {speechSupported && (
          <button
            onClick={handleSpeechToggle}
            className={`p-2 rounded transition-colors cursor-pointer ${
              isListening 
                ? 'text-[#FF4444] bg-[#3C3C3C] animate-pulse' 
                : 'text-[#808080] hover:text-[#D4D4D4]'
            }`}
            title={isListening ? "Stop voice recording" : "Start voice recording"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        )}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="p-2 bg-[#333333] text-[#D4D4D4] text-xs rounded mt-2 w-10 focus:outline-none"
          title="Select Theme"
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex flex-col bg-[#1E1E1E]">
        <div className="h-9 bg-[#252526] border-b border-[#3C3C3C] flex items-center px-4">
          <div className="flex items-center gap-2 bg-[#1E1E1E] px-3 py-1 rounded-t border-t-2 border-[#9CDCFE]">
            <Code size={14} className="text-[#9CDCFE]" />
            <span className="text-sm">input.{language}</span>
            {isListening && (
              <div className="flex items-center gap-1 text-xs text-[#FF4444]">
                <Volume2 size={12} className="animate-pulse" />
                <span>Recording...</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-8 bg-[#252526] border-b border-[#3C3C3C] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#333333] text-[#D4D4D4] text-xs rounded p-1 focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-[#5A5A5A]">UTF-8</div>
            {speechSupported && (
              <button
                onClick={handleSpeechToggle}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  isListening
                    ? 'bg-[#FF4444] hover:bg-[#FF6666] text-white'
                    : 'bg-[#4A4A4A] hover:bg-[#5A5A5A] text-[#D4D4D4]'
                }`}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                {isListening ? 'Stop Recording' : 'Voice Input'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-[#808080]">
              Ln {inputCode.split("\n").length}, Col {inputCode.split("\n").pop()?.length || 0}
            </div>
            {inputCode && (
              <button
                onClick={clearInputCode}
                className="px-2 py-1 bg-[#666666] hover:bg-[#777777] rounded text-white text-xs"
                title="Clear input"
              >
                Clear
              </button>
            )}
            {validationError && suggestedLanguage && (
              <button
                onClick={switchLanguage}
                className="ml-2 px-2 py-1 bg-[#0E639C] hover:bg-[#1177BB] rounded text-white text-xs"
              >
                Switch to {languages.find((lang) => lang.value === suggestedLanguage)?.label}
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isPending || !inputCode.trim()}
              className="flex items-center gap-1 px-3 py-1 bg-[#0E639C] hover:bg-[#1177BB] disabled:bg-[#3C3C3C] disabled:text-[#5A5A5A] rounded transition-colors text-white text-xs font-semibold"
            >
              <Play size={12} />
              {isPending ? "Running..." : "Run AI"}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            theme={theme}
            value={inputCode}
            onChange={(value) => setInputCode(value || "")}
            onMount={handleEditorMount}
            options={{
              fontFamily: "'Fira Code', 'Consolas', monospace",
              fontSize: 14,
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              tabSize: 2,
              wordWrap: "on",
              automaticLayout: true,
              folding: true,
              autoIndent: "full",
              formatOnPaste: true,
              formatOnType: true,
              suggest: {
                showSnippets: true,
                showWords: true,
              },
              renderLineHighlight: "all",
              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                useShadows: true,
              },
            }}
          />
        </div>

        <div className="h-6 bg-[#007ACC] text-white flex items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-4">
            <span>{languages.find((lang) => lang.value === language)?.label}</span>
            <span>{inputCode.length} characters</span>
            <span>{inputCode.split("\n").length} lines</span>
            {speechSupported && isListening && (
              <span className="flex items-center gap-1 text-[#FFD700]">
                <Mic size={12} className="animate-pulse" />
                Listening...
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#1E1E1E] border-l border-[#3C3C3C]">
        <div className="h-9 bg-[#252526] border-b border-[#3C3C3C] flex items-center px-4">
          <div className="flex items-center gap-2 bg-[#1E1E1E] px-3 py-1 rounded-t border-t-2 border-[#00FF00]">
            <Sparkles size={14} className="text-[#00FF00]" />
            <span className="text-sm">ai-response.{language}</span>
          </div>
        </div>

        <div className="h-8 bg-[#252526] border-b border-[#3C3C3C] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="text-xs text-[#808080]">
              {languages.find((lang) => lang.value === language)?.label} Output
            </div>
            {isPending && (
              <div className="flex items-center gap-1 text-xs text-[#00FF00]">
                <div className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse"></div>
                Generating...
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {displayedResponse && (
              <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-[#3C3C3C] rounded transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <Check size={14} className="text-[#00FF00]" />
                ) : (
                  <Copy size={14} className="text-[#808080]" />
                )}
              </button>
            )}
            <div className="text-xs text-[#808080]">
              {displayedResponse.split("\n").length} lines
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {!displayedResponse && !isPending && (
            <div className="h-full flex items-center justify-center text-[#5A5A5A]">
              <div className="text-center">
                <Sparkles size={48} className="mx-auto mb-4 text-[#808080]" />
                <p className="text-lg mb-2">AI Response will appear here</p>
                <p className="text-sm">Enter your code and click "Run AI" to get started</p>
                {speechSupported && (
                  <p className="text-xs mt-2 text-[#808080]">
                    💡 Try using voice input with the microphone button
                  </p>
                )}
              </div>
            </div>
          )}
          {isPending && (
            <div className="h-full flex items-center justify-center text-[#5A5A5A]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF00] mx-auto mb-4"></div>
                <p className="text-lg mb-2">AI is thinking...</p>
                <p className="text-sm">Processing your code</p>
              </div>
            </div>
          )}
          {displayedResponse && (
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={displayedResponse}
              options={{
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: 14,
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                tabSize: 2,
                wordWrap: "on",
                automaticLayout: true,
                folding: true,
                renderLineHighlight: "all",
                readOnly: true,
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                  useShadows: true,
                },
              }}
              onMount={handleEditorMount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPromptPage;