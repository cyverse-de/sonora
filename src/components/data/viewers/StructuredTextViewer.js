/**
 * View structured text files
 *
 * @author sriram
 *
 */

import React from "react";
import dynamic from 'next/dynamic'
import PageWrapper from "components/layout/PageWrapper";
import { NoSsr } from "@material-ui/core";

const CsvTable = dynamic(()=> import("react-csv-to-table").then((mod) => mod.CsvToHtmlTable))

export default function StructuredTextViewer(props) {
    let csv = "";
    const {data, columns, delimiter} = props;
    if(data?.length > 0) {
        data.forEach((row, index)=> {
            let csvRow = "";
            for (let i = 0; i<columns; i++) {
                csvRow = Object.values(row).join(",");
                console.log("row ->" + index + " ->" + csvRow);
            }   
            csv = csv.concat(csvRow, "\n");
        })
    }
    return (
        <NoSsr>
            <PageWrapper appBarHeight={60}>
                <div style={{ overflow: "auto" }}>
                    <CsvTable
                        data={csv}
                        csvDelimiter={delimiter}
                        tableClassName="table table-striped table-hover"
                    />
                </div>
            </PageWrapper>
        </NoSsr>
    );
}
