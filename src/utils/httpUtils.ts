/** Http Utils */

type ProcessJsonOnErrorFun<T> = (res: Response) => T;
type ProccessJsonDefaultValue<T> = T;

/** Takes an API response and checks for errors and returns the right output */
export async function processResJson<T>(res: Response, arg2: ProccessJsonDefaultValue<T> | ProcessJsonOnErrorFun<T>): Promise<T> {

    try {
        if (res.ok) {
            const json = await res.json() as T;
            return json;
        }

    } catch (error) {
        console.log("Error parsing response");
    }

    if (typeof arg2 === "function") {
        const func = arg2 as ProcessJsonOnErrorFun<T>;
        return func(res);
    }

    const returnVal = arg2 as ProccessJsonDefaultValue<T>;
    return returnVal;

}

export async function fetchCall<T>(func: () => Promise<Response>, defaultValue: T) : Promise<T> {

    try {
        const res = await func();
        return processResJson(res, defaultValue);
    } catch (error) {
        console.log('Error running fetch call');
        return defaultValue;
    }
}