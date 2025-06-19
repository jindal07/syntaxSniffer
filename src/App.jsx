import React ,{ useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import  CircleLoader  from "react-spinners/CircleLoader";


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

  const style = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      borderColor: "#555",
      color: "white",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      color: "white",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#555" : isFocused ? "#333" : "#1a1a1a",
      color: "white",
    }),
  };

  const themes = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "#333", // option hover background
      primary: "#555", // selected option background
      neutral0: "#1a1a1a", // control background
      neutral80: "white", // input text color
      neutral20: "#555", // control border
      neutral30: "#888", // border on hover
    },
  });

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
              className="cursor-pointer w-50 h-10  mx-2 my-2 absolute top-0 left-0 "
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e);
              }}
              options={options}
              theme={themes}
              styles={style}
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
                className="btnNormal transition-all hover:bg-zinc-700 bg-zinc-900 px-3 py-2 my-2 mx-2 rounded-md cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>

          <div>
            <Editor
              theme="vs-dark"
              height="90vh"
              language={selectedOption.value}
              value={code}
              onChange={(e) => {
                setCode(e);
              }}
              className=" mx-1 border-1 "
            />
          </div>
        </div>
        <div className="right p-[10px] bg-zinc-900 w-[55%] h-screen overflow-auto my-3 mx-1 flex-wrap">
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justify-between h-[60px] m-2">
            <h1 className="font-[700] text-[25px] ">Response</h1>
          </div>
          {loading && <CircleLoader color="#ffffff"/>}
          <Markdown >{response}</Markdown>
        </div>
      </div>
    </>
  );
}

export default App;
