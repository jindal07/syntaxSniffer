import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor, { useMonaco } from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import CircleLoader from "react-spinners/CircleLoader";

function App() {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "typescript", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "php", label: "PHP" },
  ];
  const brainDarkStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#1e3a8a",
      borderColor: state.isFocused ? "#702963" : "#3f51b5",
      borderRadius: "12px",
      boxShadow: state.isFocused ? "0 0 0 2px #70296388" : "none",
      "&:hover": {
        borderColor: "#702963",
      },
      color: "#ffffff",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1e3a8a",
      borderRadius: "12px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
      marginTop: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "#702963"
        : state.isSelected
        ? "#4e2677"
        : "transparent",
      color: "#ffffff",
      "&:active": {
        backgroundColor: "#702963",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#ffffff",
    }),
    input: (base) => ({
      ...base,
      color: "#ffffff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#cbd5e1",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#F28CB1" : "#ffffff",
      "&:hover": {
        color: "#F28CB1",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("brain-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", foreground: "E0E0E0", background: "1e3a8a" },
          { token: "comment", foreground: "7F9CF5", fontStyle: "italic" },
          { token: "string", foreground: "F28CB1" },
          { token: "keyword", foreground: "C792EA" },
          { token: "number", foreground: "F78C6C" },
          { token: "function", foreground: "82AAFF" },
          { token: "type", foreground: "FFCB6B" },
        ],
        colors: {
          "editor.background": "#1e3a8a",
          "editor.foreground": "#E0E0E0",
          "editorCursor.foreground": "#F28CB1",
          "editor.lineHighlightBackground": "#70296333",
          "editorLineNumber.foreground": "#94a3b8",
          "editor.selectionBackground": "#70296366",
          "editor.inactiveSelectionBackground": "#70296333",
        },
      });
    }
  }, [monaco]);

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyAX0MaBhC4_sWLI4QiEMuYmPtBtqb9eQtI",
  });

  async function reviewCode() {
    setResponse("");
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1  A quality rating: Better, Good, Normal, or Bad.
2  Detailed suggestions for improvement, including best practices and advanced alternatives.
3  A clear explanation of what the code does, step by step.
4  A list of any potential bugs or logical errors, if found.
5  Identification of syntax errors or runtime errors, if present.
6  Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}
`,
    });
    console.log(response.text);
    setLoading(false);
    setResponse(response.text);
  }

  return (
    <>
      <Navbar />
      <div className="main flex items-center justify-between ">
        <div className="left h-screen w-[45%] ">
          <div className=" tabs w-full flex my-1 justify-between">
            <Select
              className="cursor-pointer w-50 h-10 shadow-2xl mx-2 my-2 absolute top-0 left-0 "
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e);
              }}
              options={options}
              styles={brainDarkStyles}
            />
            <div>
              {/* <button className="btnNormal transition-all hover:bg-zinc-700 bg-zinc-900 px-3 py-2 my-2 mx-2 rounded-md cursor-pointer">
                Fix Code
              </button> */}
              <button
                onClick={() => {
                  if (code === "") {
                    alert("Please enter the code");
                  } else {
                    reviewCode();
                  }
                }}
                className="btnNormal transition-all text-amber-50  hover:bg-[radial-gradient(circle_at_30%_30%,_#e6648d,_#6b77e5)] shadow-2xl bg-[radial-gradient(circle_at_30%_30%,_#702963,_#1e3a8a)] px-3 py-2 my-2 mx-2 rounded-md cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>

          <div className=" mx-1 rounded-2xl shadow-2xl">
            <Editor
              theme="brain-dark"
              height="90vh"
              language={selectedOption.value}
              value={code}
              onChange={(e) => {
                setCode(e);
              }}
            />
          </div>
        </div>
        <div className="right rounded-2xl p-3 bg-[radial-gradient(circle_at_30%_30%,_#e6648d,_#6b77e5)] w-[55%] h-screen overflow-auto my-5 mx-3 flex-wrap scroll-auto">
          <div className="topTab border-2 p-2 rounded-2xl border-[#602c6a] shadow-2xl flex items-center justify-between h-[60px] m-2">
            <h1 className="font-[700] text-[25px] ">Response</h1>
          </div>
          <div className="flex items-center justify-center  m-auto">
            {loading && <CircleLoader color="#602c6a" />}
          </div>

          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  );
}

export default App;
