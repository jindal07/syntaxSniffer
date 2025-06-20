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
      monaco.editor.defineTheme("pinkBlueContrast", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", foreground: "FADADD", background: "1E1E2F" },
          { token: "comment", foreground: "808080" },
          { token: "keyword", foreground: "C792EA", fontStyle: "bold" },
          { token: "string", foreground: "A3D8FF" },
          { token: "function", foreground: "FFD580" },
        ],
        colors: {
          "editor.background": "#1E1E2F",
          "editor.foreground": "#FADADD",
          "editorCursor.foreground": "#FFB7C5",
          "editor.lineHighlightBackground": "#2C2C3A",
          "editorLineNumber.foreground": "#808080",
          "editor.selectionBackground": "#44475a",
          "editor.inactiveSelectionBackground": "#44475a88",
        },
      });

      monaco.editor.setTheme("pinkBlueContrast");
    }
  }, [monaco]);

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY,
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
                className="btnNormal  text-amber-50  shadow-2xl px-3 py-2 my-2 mx-2 rounded-md cursor-pointer bg-[#1e3a8a] hover:opacity-90 transition"
              >
                Review
              </button>
            </div>
          </div>
          <div className="shadow-2xl">
            <h3 className="border-2 px-2 py-1 shadow-2xl rounded-xl ">
              Write your {selectedOption.value} code below:
            </h3>
          </div>

          <div className=" mx-1 rounded-2xl shadow-2xl">
            <Editor
              className="shadow-2xl"
              theme="pinkBlueContrast"
              height="82vh"
              language={selectedOption.value}
              value={code}
              onChange={(e) => {
                setCode(e);
              }}
            />
          </div>
        </div>
        <div className="right rounded-2xl shadow-2xl p-3 bg-[radial-gradient(circle_at_30%_30%,_#e6648d,_#6b77e5)] w-[55%] h-screen overflow-auto my-5 mx-3 flex-wrap scroll-auto">
          <div className=" topTab opacity-90 sticky top-0 z-10  border-2 p-2 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,_#e6648d,_#6b77e5)] border-[#602c6a] shadow-2xl flex items-center justify-between h-[60px] my-2 mx-0.5">
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
