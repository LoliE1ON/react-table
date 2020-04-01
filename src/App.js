import React from 'react';
import {MatrixTable} from "./MatrixTable";

export const App = () => (
    <div>
        <MatrixTable
            newItemCriterions={[
                { name: 'test criterion', points: 2, editable: false },
                { name: 'test criterion 2', points: 5, editable: false },
                { name: 'test criterion 3', points: 2, editable: false },
            ]}
            newItemOptions={[
                { name: 'test option', criterions: [], summary: 0, editable: false },
                { name: 'test option 2', criterions: [], summary: 0, editable: false },
                { name: 'test option 3', criterions: [], summary: 0, editable: false },
                { name: 'test option 4', criterions: [], summary: 0, editable: false },
                { name: 'test option 5', criterions: [], summary: 0, editable: false },
            ]}
        />
    </div>
    );