import React, { useEffect, useRef, useState } from "react"; //eslint-disable-line
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Status_Completed } from "../icons";
import styles from '../index.module.scss'
import stepStyles from './artifact.module.scss'
import { FullWidthSpinner } from "../../spinners";

const stylesActive = {
    opacity: 1, transition: "", transform: ""
}
const stylesInActive = {
    opacity: 0.5, transition: "", transform: ""
}

const tabs = [
    {
        title: "Config",
        case: "__CONFIG"
    },
    {
        title: "Logs",
        case: "__LOG"
    },
    {
        title: "Attributes",
        case: "__ATTRIBUTE"
    },
    {
        title: "Code",
        case: "__CODE"
    },
]


const TextInput: React.FC<any> = ({ label, value }) => {

    const [input, setInput] = useState('');


    const handleChange = (event:any) =>{
        setInput(event.target.value);
    }

    useEffect(() => {
        value(input)
    }, [input]) //eslint-disable-line
    

    return (
        <div>
            <p>{label}</p>
            <input placeholder={label} onChange={(e) => handleChange(e)} />
        </div>
    )
}
// USE GUIDE: JUST CREATE A STATE WHERE YOU USE THIS COMPONENT AND PASS THE "SET" METHOD IN VALUE
const ToggleButton: React.FC<any> = ({label, value}) => { //eslint-disable-line
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
      setIsActive(!isActive);
    };

    useEffect(() => {
        value(isActive)
    }, [isActive]) //eslint-disable-line
    
  
    return (
      <button className={`toggle-button ${isActive ? "active" : ""}`} onClick={handleClick}>
        <div className="toggle-button__thumb"></div>
      </button>
    );
  };

const StepnodeTabHeader: React.FC<any> = ({ node, logs }) => {



    const [show, setShow] = useState("__CONFIG");
    const [dynamicWidth, setDynamicWidth] = useState<number | undefined>(50);
    const [dynamicLeft, setDynamicLeft] = useState<number | undefined>(21);
    const [fetching, setFetching] = useState(true); //eslint-disable-line
    const divRefs = useRef<(HTMLSpanElement | null)[]>([])

    // INPUTS STATES
    const [input1, setInput1] = useState(''); //eslint-disable-line
    const [input2, setInput2] = useState(''); //eslint-disable-line
    const [input3, setInput3] = useState(''); //eslint-disable-line
    const [input4, setInput4] = useState(''); //eslint-disable-line
    const [input5, setInput5] = useState(''); //eslint-disable-line
    

    useEffect(() => {
        setDynamicLeft(divRefs.current[1]?.offsetLeft);
        setDynamicWidth(divRefs.current[1]?.offsetWidth);
        console.log("__unauth_dynamic_Left", dynamicLeft)
        console.log("__unauth_dynamic_width", dynamicWidth)
    }, [])//eslint-disable-line

    useEffect(() => {
        setDynamicLeft(dynamicLeft);
        setDynamicWidth(dynamicWidth);
    }, [show, dynamicLeft, dynamicWidth, node])//eslint-disable-line


    if (Object.keys(node).length === 0) {
        return <FullWidthSpinner color="black" size="md" />;
    }
    const handleClick = (divId: number) => {
        setDynamicLeft(divRefs.current[divId]?.offsetLeft);
        setDynamicWidth(divRefs.current[divId]?.offsetWidth);
    };


    const TabClickHandler = (tab: string) => {
        switch (tab) {
            case "__CONFIG": return setShow("__CONFIG");
            case "__LOG": return setShow("__LOG");
            case "__ATTRIBUTE": return setShow("__ATTRIBUTE");
            case "__CODE": return setShow("__CODE");
            default: return "";
        }
    }



    return (
        <>
            <div className='siderbar_header11'>
                {tabs.map((tab, i) => {
                    return (
                        <span
                            key={i}
                            id={i.toString()}
                            onClick={() => {
                                handleClick(i + 1)
                                TabClickHandler(tab.case);
                            }}
                            style={show === tab.case ? stylesActive : stylesInActive}
                            ref={(el) => divRefs.current[i + 1] = el}
                        >{tab.title}</span>

                    )
                })}
            </div>
            <div className={`${stepStyles.underline}`} style={{ marginLeft: `${dynamicLeft}px`, transition: 'all 300ms ease', width: `${dynamicWidth}px` }}></div>


            {
                show === "__ATTRIBUTE" ?
                    <>
                        <table className='sidebar_table'>
                            <tbody>
                                <tr>
                                    <td className='td_key'>Status</td>
                                    {node.status && node.status === "completed" ?
                                        <>
                                            <td className='td_value' style={{ color: '#2ECC71', fontSize: 14, fontWeight: 600 }}>{node.status}</td>
                                            <td><Status_Completed /> {/*eslint-disable-line*/}</td>
                                            &nbsp;&nbsp;&nbsp;
                                        </>
                                        :
                                        <td className='td_value'>{node.status}</td>
                                    }
                                </tr>
                                <tr>
                                    <td className='td_key'>ID</td>
                                    <td className='td_value'>{node.id}</td>
                                </tr>
                                <tr>
                                    <td className='td_key'>start_time</td>
                                    <td className='td_value'>{node?.created}</td>
                                </tr>
                                <tr>
                                    <td className='td_key'>end_time</td>
                                    <td className='td_value'>{node?.end_time}</td>
                                </tr>
                                <tr>
                                    {node.original_step_run_id && node.original_step_run_id !== null ?
                                        <>
                                            <td className='td_key'>original_step_run_id</td>
                                            <td className='td_value'>{node?.original_step_run_id}</td>
                                        </> : <></>
                                    }
                                </tr>
                                <tr>
                                    <td className='td_key'>cache_key</td>
                                    <td className='td_value'>{node?.cache_key}</td>
                                </tr>
                                <tr>
                                    <td className='td_key'>docstring</td>
                                    <td className='td_value'>{node?.docstring}</td>
                                </tr>
                                <tr>
                                    <td className='td_key'>enable_cache</td>
                                    <td className='td_value'>{node?.docstring}</td>
                                </tr>
                                <tr>
                                    {node.enable_artifact_metadata && node.enable_artifact_metadata ?
                                        <>
                                            <td className='td_key'>enable_artifact_metadata</td>
                                            <td className='td_value'>{node?.enable_artifact_metadata}</td>
                                        </>
                                        : <></>
                                    }
                                </tr>
                                {/* <tr>
                                    <td className='td_key'>source</td>
                                    <td className='td_value'>{node?.step?.spec?.source}</td>
                                </tr> */}
                                <tr>
                                    <td className='td_key'>pipeline_parameter_name</td>
                                    <td className='td_value '>{node?.step?.spec?.pipeline_parameter_name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                    : ""
            }
            {
                show === "__CODE" ?
                    <div className={styles.codeContainer}>
                        <SyntaxHighlighter
                            customStyle={{ width: '100%', height: '80%', fontSize: 20 }}
                            wrapLines={true}
                            language="python"
                            style={okaidia}

                        >
                            {node.source_code ? node.source_code : ""}
                        </SyntaxHighlighter>
                    </div>
                    : ""
            }
            {
                show === "__LOG" ?
                    <div className={styles.codeContainer}>
                        <SyntaxHighlighter
                            customStyle={{ width: '100%', height: '80%', fontSize: 16 }}
                            wrapLines={true}
                            language="python"
                            style={okaidia}
                        >
                            {logs ? logs : "No Logs Avaialable"}
                        </SyntaxHighlighter>
                    </div>
                    : ""
            }
            {show === "__CONFIG" ?

                <>
                    <div className='config_container'>
                        <TextInput label={"Component Name"} value={setInput1} />
                        <TextInput label={"Kubernetes Context"} value={setInput2} />
                        <TextInput label={"Kubernetes Context"} value={setInput3} />
                        <TextInput label={"Kubernetes Context"} value={setInput4} />
                        <TextInput label={"Kubernetes Context"} value={setInput5} />
                    </div>
                        {/* <ToggleButton value={setInput5}/> */}
                </>
                : ""
            }

        </>
    )
}


export default StepnodeTabHeader;