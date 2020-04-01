import React, {useEffect, useState} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./matrixStyles.css";

const MatrixTable = ({newItemOptions = [], newItemCriterions = []}) => {

    const [criterions, setCriterions] = useState([]);
    const [options, setOptions] = useState([]);
    const [remove, setRemove] = useState({
        criterion: -1, // or index for remove
        option: -1, // or index for remove
    });

    // Add new options
    useEffect(() => {
        if (newItemOptions[0]) setOptions(prevState => [
            ...prevState,
            ...newItemOptions
        ])
    }, [newItemOptions]);

    // Add new criterions
    useEffect(() => {
        if (newItemCriterions[0]) setCriterions(prevState => [
            ...prevState,
            ...newItemCriterions
        ])
    }, [newItemCriterions]);

    // Close all editable columns
    useEffect(() => {
        document.body.addEventListener('click', onBodyClick);
        return () => document.body.removeEventListener('click', onBodyClick);
    });

    // Computed new criterions for options
    useEffect(() => {
        setOptions(prevState => prevState.map(option => ({
            ...option,
            criterions: criterions.map((criterion, key) => option.criterions[key] ? option.criterions[key] : 0)
        })))
    }, [criterions]);

    // Change criterion points for option
    const onChangeOptionCriterion = (optionKey, criterionKey, value) => {
        setOptions(prevState => prevState.map((option, key) => {
            return key === optionKey ? {
                ...option,
                criterions: option.criterions.map((criterion, key) => {
                    return key === criterionKey ?  (value > 10 ? 10 : value) : criterion
                })
            } : option
        }));
    };

    // Change criterion points
    const onChangeCriterionPoints = (criterionKey, value) => {
        setCriterions(prevState => prevState.map((criterion, key) => {
            return key === criterionKey ? {
                ...criterion,
                points: (value > 5 ? 5 : value)
            } : criterion
        }))
    };

    // Edit option name
    const onEditableOption = (optionKey, value, e) => {
        if (e.target.tagName === "INPUT") return;
        setOptions(prevState => prevState.map((option, key) => {
            return key === optionKey ? {
                ...option,
                editable: value
            } : option
        }));
    };

    // Set option name
    const setOptionName = (optionKey, value) => {
        setOptions(prevState => prevState.map((option, key) => {
            return key === optionKey ? {
                    ...option,
                    name: value
            } : option
        }));
    };

    // Set critetion name
    const setCriterionName = (ctiretionKey, value) => {
        setCriterions(prevState => prevState.map((criteria, key) => {
            return key === ctiretionKey ? {
                ...criteria,
                name: value
            } : criteria
        }));
    };

    // Edit option name
    const onEditableCriterion = (ctiretionKey, value, e) => {
        if (e.target.tagName === "INPUT") return;
        setCriterions(prevState => prevState.map((criteria, key) => {
            return key === ctiretionKey ? {
                ...criteria,
                editable: value
            } : criteria
        }));
    };

    // Close all editable columns
    const onBodyClick = (e) => {
        if (e.target.tagName !== "INPUT") {
            setOptions(prevState => prevState.map((option, key) => ({
                ...option,
                editable: false
            })));

            setCriterions(prevState => prevState.map((criterion, key) => ({
                ...criterion,
                editable: false
            })));
        }

        const cols = document.querySelectorAll("#matrix > .row > .col");


        const parent = e.target.tagName === "INPUT" ? e.target.parentNode : e.target;
        cols.forEach(elem => {
            if(parent !== elem) elem.classList.remove("selected-col");
        })

    };

    // Add new option
    const addNewOption = () => {
        setOptions(prevState => [...prevState,
            { name: 'new option', criterions: criterions.map(() => 0), summary: 0, editable: true },
        ]);
    };

    // Add new cripterion
    const addNewCriterion = () => {
        setCriterions(prevState => [...prevState,
            { name: 'new criterion', points: 1, editable: false },
        ]);
    };

    // Remove option
    const removeOption = () => {
        setOptions(prevState => {
            const arr = [];
            prevState.forEach((option, key) => {
               if (remove.option !== key) arr.push(option)
            });
            return arr
        });
        setRemove({
            option: -1,
            criterion: -1,
        });
    };

    // Remove critetia
    const removeCriteria = () => {
        setCriterions(prevState => {
            const arr = [];
            prevState.forEach((criteria, key) => {
                if (remove.criterion !== key) arr.push(criteria)
            });
            return arr
        });
        setRemove({
            option: -1,
            criterion: -1,
        });
    };

    // Select remove item
    const onSelectRemoveItem = (params = {criterion: -1, option: -1}) => {
        setRemove(prevState => ({
            criterion: params.criterion,
            option: params.option,
        }));
    };

    return (
        <div id="matrix" className="container pt-5">

            <div className="row pb-5">
                <div className="btn-group mr-2" id="matrix-btn-control" role="group">
                    <button type="button" className="btn btn-secondary" onClick={addNewCriterion}>Add criteria</button>
                    <button type="button" className="btn btn-secondary" onClick={removeCriteria} disabled={remove.criterion < 0}>Remove criteria</button>
                </div>
                <div className="btn-group" id="matrix-btn-control" role="group">
                    <button type="button" className="btn btn-secondary" onClick={addNewOption}>Add option</button>
                    <button type="button" className="btn btn-secondary" onClick={removeOption} disabled={remove.option < 0}>Remove option</button>
                </div>
            </div>

            <div className="row">

                <div className="col p-2 border "></div>

                { criterions.map((criterion, key) => {

                    return (
                        <div key={key} className="col p-2 border cp" onClick={(e) => {
                            onEditableCriterion (key, !criterion.editable, e);
                            onSelectRemoveItem({ criterion: key, option: -1});
                            if (e.target.tagName !== "INPUT") e.target.classList.add("selected-col");
                        }}>

                            {
                                criterion.editable ?
                                    <input
                                        className="matrix-input"
                                        autoFocus
                                        type="text"
                                        value={criterion.name}
                                        onChange={(e) => setCriterionName(key, e.target.value)}
                                    />
                                : criterion.name
                        }
                        </div>
                    );
                })}

                <div className="col p-2 border">Summary</div>

            </div>

            <div className="row">
                <div className="col p-2 border"><b>Weight</b></div>

                { criterions.map((criterion, key) => (
                    <div className="col p-2 border text-right" onClick={(e) => {
                        onSelectRemoveItem({ criterion: key, option: -1});
                        if (e.target.tagName !== "INPUT") e.target.classList.add("selected-col");
                    }} key={key}>
                        <input type="number"
                               className="input-nums"
                               autoFocus
                               onChange={ (e) => onChangeCriterionPoints(key, +e.target.value)}
                               value={criterion.points}
                               onClick={(e) => {
                                   onSelectRemoveItem({ criterion: key, option: -1})
                                   e.target.parentNode.classList.add("selected-col");
                               }}
                               min="1"
                               max="5"
                        />
                    </div>
                ))}

                <div className="col p-2 border"></div>
            </div>

            { options.map((option, optionKey) => (
                <div key={optionKey} className="row">
                    <div className="col p-2 border " onClick={(e) => {
                        onSelectRemoveItem({ criterion: -1, option: optionKey})
                        if (e.target.tagName !== "INPUT") e.target.classList.add("selected-col");
                    }}>

                        { option.editable ?

                                <input
                                    type="text"
                                    autoFocus
                                    value={option.name}
                                    onChange={(e) => setOptionName(optionKey, e.target.value)}
                                />
                            :
                            <div className="cp" onClick={(e) => {
                                onEditableOption(optionKey, true, e)
                                e.target.parentNode.classList.add("selected-col");
                            }}>
                                { option.name }
                            </div>
                        }
                    </div>

                    { criterions.map((criterion, criterionKey) => (
                        <div className="col p-2 border text-right" onClick={(e) => {
                            onSelectRemoveItem({ criterion: criterionKey, option: optionKey})
                            if (e.target.tagName !== "INPUT") e.target.classList.add("selected-col");
                        }} key={criterionKey}>
                            <input className="input-nums" type="number"
                                   onChange={ (e) => onChangeOptionCriterion(optionKey, criterionKey, +e.target.value)}
                                   value={option.criterions[criterionKey] || 0 }
                                   min="0"
                                   onClick={(e) => {
                                       onSelectRemoveItem({ criterion: criterionKey, option: optionKey})
                                       e.target.parentNode.classList.add("selected-col");
                                   }}
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