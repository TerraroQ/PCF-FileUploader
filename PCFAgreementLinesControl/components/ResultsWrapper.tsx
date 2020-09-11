import React, { useEffect } from 'react'
import { IAppLogic } from '../interfaces/app-logic';
import { useFilterContext } from '../contexts/FilterContext';
import FilterResults from './FilterResults';
import { useResultContext } from '../contexts/ResultsContext';

const ResultsWrapper = (props: { appLogic: IAppLogic }) => {

    const { appLogic } = props;
    const { filters } = useFilterContext();
    const { results, updateResults } = useResultContext();
    
    async function getResults() {
        console.log(filters);
        updateResults(await appLogic.getAgreementlines(filters));
        console.log(results);
    }
    useEffect(() => {
        console.log(results);
        if(filters.direction !== "") {
            getResults();
            console.log(results)
        }
    }, [filters]);

    return (
        <>
            {results && results.length ?
                <FilterResults appLogic={appLogic} /> :
                <div>No Results</div>
            }
        </>
    )
}

export default ResultsWrapper
