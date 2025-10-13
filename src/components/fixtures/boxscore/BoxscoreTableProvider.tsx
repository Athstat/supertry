import { ScopeProvider } from "jotai-scope"
import { boxscoreTableAtoms } from "../../../state/fixtures/boxscore.atoms"
import { BoxscoreHeader, BoxscoreListRecordItem } from "../../../types/boxScore"
import { Fragment, ReactNode, useEffect } from "react"
import { useSetAtom } from "jotai"
import { title } from "process"

type Props = {
    tableTitle?: string,
    columns: BoxscoreHeader[],
    children?: ReactNode,
    records: BoxscoreListRecordItem[]
}

/** Boxscore Table Provider */
export default function BoxscoreTableProvider({children, columns, tableTitle, records} : Props) {
    
    const atoms = [
        boxscoreTableAtoms.titleAtom,
        boxscoreTableAtoms.columnsAtom,
        boxscoreTableAtoms.recordsAtom
    ]
    
    return (
        <ScopeProvider atoms={atoms} >
            <InnerProvider
                columns={columns}
                records={records}
                tableTitle={tableTitle}
            >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}

function InnerProvider({children, columns, tableTitle, records} : Props) {
    
    const setColumns = useSetAtom(boxscoreTableAtoms.columnsAtom);
    const setTitle = useSetAtom(boxscoreTableAtoms.titleAtom);
    const setRecords = useSetAtom(boxscoreTableAtoms.recordsAtom);
    
    useEffect(() => {
        
        if (columns) {
            setColumns(columns);
        }

        if (tableTitle) {
            setTitle(title);
        }

        if (records) {
            setRecords(records);
        }

    }, [columns, tableTitle, records, setRecords, setColumns, setTitle]);

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}