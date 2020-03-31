import React, {useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

const MatrixTable = () => {

    const [criterions, setCriterions] = useState([
        { name: 'criterion', points: 2, editable: false },
        { name: 'criterion 2', points: 2, editable: false },
    ]);

    const [options, setOptions] = useState([
        { name: 'option 1', criterions: [5, 5], summary: 0, editable: false },
        { name: 'option 2', criterions: [2, 4], summary: 0, editable: false },
    ]);

    // Close all editable columns
    useEffect(() => {
        document.body.addEventListener('click', onBodyClick);
        return () => document.body.removeEventListener('click', onBodyClick);
    });

    useEffect(() => {
        setOptions(prevState => prevState.map(option => ({
            ...option,
            criterions: criterions.map((criterion, key) => option.criterions[key] ? option.criterions[key] : 0)
        })))
    }, [criterions]);

    // Change criterion points for option
    const onChangeOptionCriterion = (optionKey, criterionKey, value) => {
        setOptions(prevState => prevState.map((option, key) => {
            if (key === optionKey) {
                return {
                    ...option,
                    criterions: option.criterions.map((criterion, key) => {
                        if (key === criterionKey) return (value > 10 ? 10 : value)
                        else return criterion
                    })
                }
            } else return option
        }));
    };

    // Change criterion points
    const onChangeCriterionPoints = (criterionKey, value) => {
        setCriterions(prevState => prevState.map((criterion, key) => {
            if (key === criterionKey) {
                return {
                    ...criterion,
                    points: (value > 5 ? 5 : value)
                }
            } else return criterion
        }))
    };

    // Edit option name
    const onEditableOption = (optionKey, value, e) => {
        if (e.target.tagName === "INPUT") return;
        setOptions(prevState => prevState.map((option, key) => {
            if (key === optionKey) {
                return {
                    ...option,
                    editable: value
                }
            } else return option
        }));
        console.log("lol", value)
    };

    // set option name
    const setOptionName = (optionKey, value) => {
        setOptions(prevState => prevState.map((option, key) => {
            if (key === optionKey) {
                return {
                    ...option,
                    name: value
                }
            } else return option
        }));
    };

    // set critetion name
    const setCriterionName = (ctiretionKey, value) => {
        setCriterions(prevState => prevState.map((criteria, key) => {
            if (key === ctiretionKey) {
                return {
                    ...criteria,
                    name: value
                }
            } else return criteria
        }));
    };

    // Edit option name
    const onEditableCriterion = (ctiretionKey, value, e) => {
        if (e.target.tagName === "INPUT") return;
        setCriterions(prevState => prevState.map((criteria, key) => {
            if (key === ctiretionKey) {
                return {
                    ...criteria,
                    editable: value
                }
            } else return criteria
        }));
    };

    // Close all editable columns
    const onBodyClick = (e) => {
        if (e.target.tagName === "INPUT") return;
        setOptions(prevState => prevState.map((option, key) => ({
            ...option,
            editable: false
        })));

        setCriterions(prevState => prevState.map((criterion, key) => ({
            ...criterion,
            editable: false
        })));

    };

    // Add new option
    const addNewOption = () => {
        setOptions(prevState => [...prevState,
            { name: 'new option', criterions: criterions.map(() => 0), summary: 0, editable: false },
        ]);
    };

    // Add new cripterion
    const addNewCriterion = () => {
        setCriterions(prevState => [...prevState,
            { name: 'new criterion', points: 1, editable: false },
        ]);
    };

    return (
        <div className="container pt-5">

            <div className="row pb-3">
                <div className="btn-group" role="group">
                    <button type="button" className="btn btn-secondary" onClick={addNewCriterion}>Add criteria</button>
                    <button type="button" className="btn btn-secondary">Remove criteria</button>

                    <button type="button" className="btn btn-secondary" onClick={addNewOption}>Add option</button>
                    <button type="button" className="btn btn-secondary">Remove option</button>
                </div>
            </div>

            <div className="row">

                <div className="col p-2 border "></div>

                { criterions.map((criterion, key) => {
                    return (
                        <div key={key} className="col p-2 border cp" onClick={(e) => onEditableCriterion (key, !criterion.editable, e)}>
                            {
                                criterion.editable ?
                                    <input
                                        className="matrix-input"
                                        autoFocus="true"
                                        type="text"
                                        value={criterion.name}
                                        onChange={(e) => setCriterionName(key, e.target.value)}
                                    />
                                :
                                    criterion.name
                        }
                        </div>
                    );
                })}

                <div className="col p-2 border">Summary</div>

            </div>

            <div className="row">
                <div className="col p-2 border"><b>Weight</b></div>

                { criterions.map((criterion, key) => (
                    <div className="col p-2 border text-right" key={key}>
                        <input type="number"
                               className="input-nums"
                               autoFocus
                               onChange={ (e) => onChangeCriterionPoints(key, +e.target.value)}
                               value={criterion.points}
                               min="1"
                               max="5"
                        />
                    </div>
                ))}

                <div className="col p-2 border"></div>
            </div>

            { options.map((option, optionKey) => (
                <div key={optionKey} className="row">

                    <div className="col p-2 border">
                        { option.editable ?

                                <input
                                    type="text"
                                    autoFocus="true"
                                    value={option.name}
                                    onChange={(e) => setOptionName(optionKey, e.target.value)}
                                />
                            :
                            <div className="cp" onClick={(e) => onEditableOption(optionKey, true, e)}>
                                { option.name }
                            </div>
                        }
                    </div>

                    { criterions.map((criterion, criterionKey) => (
                        <div className="col p-2 border text-right" key={criterionKey}>
                            <input className="input-nums" type="number"
                                   onChange={ (e) => onChangeOptionCriterion(optionKey, criterionKey, +e.target.value)}
                                   value={option.criterions[criterionKey] || 0 }
                                   min="0"
                                   max="10"
                            />
                        </div>
                    ))}


                    <div className="col p-2 border text-right">
                        <b>{
                            option.criterions.reduce((previousValue, currentValue) => previousValue * currentValue, 1) > 0 ?
                                option.criterions.reduce((previousValue, currentValue) => previousValue * currentValue, 1)
                                +
                                criterions.reduce((acc, k) => acc * k.points, 1) : 0
                        }</b>
                    </div>

                </div>

            ))}

            <div className="row">
                <div className="col p-2 border text-black-50 cp" onClick={addNewOption}>
                    Add new option
                </div>
            </div>

        </div>
    );
}

export {
    MatrixTable,
}