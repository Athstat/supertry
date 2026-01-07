import { useAtom } from "jotai";
import { tooltipAtom } from "../../state/ui/tootip.atoms";
import { useCallback, useMemo } from "react";

export function useTooltip() {
    const [data, setData] = useAtom(tooltipAtom);

    const isTooltipModalOpen = useMemo(() => {
        return Boolean(data);
    }, [data]);

    const openTooltipModal = useCallback((title: string | undefined, description: string | undefined) => {
        if (title && description) {
            setData({title, description});
        }
    }, [setData]);

    const closeTooltipModal = useCallback(() => {
        setData(undefined);
    }, [setData]);

    return {
        data,
        setData,
        isTooltipModalOpen,
        openTooltipModal,
        closeTooltipModal
    }
}