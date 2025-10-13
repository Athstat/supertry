import { ScopeProvider } from "jotai-scope"
import { boxscoreTableAtoms } from "../../../state/fixtures/boxscore.atoms"
import { BoxscoreHeader, BoxscoreListRecordItem } from "../../../types/boxScore"
import { Fragment, ReactNode, useEffect, useMemo } from "react"
import { useAtomValue, useSetAtom } from "jotai"

type Props = {
    tableTitle?: string,
    columns: BoxscoreHeader[],
    children?: ReactNode,
    records: BoxscoreListRecordItem[],
    noContentMessage?: string
}

/** Boxscore Table Provider */
export default function BoxscoreTableProvider({ children, columns, tableTitle, records, noContentMessage }: Props) {

    const atoms = [
        boxscoreTableAtoms.titleAtom,
        boxscoreTableAtoms.columnsAtom,
        boxscoreTableAtoms.recordsAtom,
        boxscoreTableAtoms.noContentMessage
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <InnerProvider
                columns={columns}
                records={records}
                tableTitle={tableTitle}
                noContentMessage={noContentMessage}
            >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}

function InnerProvider({ children, columns, tableTitle, records, noContentMessage }: Props) {

    const setColumns = useSetAtom(boxscoreTableAtoms.columnsAtom);
    const setTitle = useSetAtom(boxscoreTableAtoms.titleAtom);
    const setRecords = useSetAtom(boxscoreTableAtoms.recordsAtom);
    const setNoContentMessage = useSetAtom(boxscoreTableAtoms.noContentMessage)

    useEffect(() => {

        if (columns) {
            setColumns(columns);
        }

        if (tableTitle) {
            setTitle(tableTitle);
        }

        if (records) {
            setRecords(records);
        }

        if (noContentMessage) {
            setNoContentMessage(noContentMessage)
        }

    }, [
        columns, tableTitle, records,
        setRecords, setColumns, setTitle,
        noContentMessage, setNoContentMessage
    ]);

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBoxscoreTable() {

    const columns = useAtomValue(boxscoreTableAtoms.columnsAtom);
    const records = useAtomValue(boxscoreTableAtoms.recordsAtom);
    const title = useAtomValue(boxscoreTableAtoms.titleAtom);
    const noContentMessage = useAtomValue(boxscoreTableAtoms.noContentMessage);


    const firstColumn = useMemo(() => {
        if (columns.length >= 1) {
            return columns[0];
        } 
    }, [columns]);

    const secondaryColumns = useMemo(() => {
        if (columns.length >= 2) {
            const copy = [...columns];
            return copy.slice(1);
        }

        return [];
    }, [columns]);

    return {
        columns,
        records,
        title,
        noContentMessage,
        firstColumn, 
        secondaryColumns
    }
}