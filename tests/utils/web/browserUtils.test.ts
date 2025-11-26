import { RouterHistoryStack } from "../../../src/utils/web/browserUtils";

describe("Test Router Stack", () => {
    test("test intializing empty router stack", () => {
        const stack = new RouterHistoryStack();
        expect(stack.peek()).toBeUndefined();
    });

    test("test pushing to router stack", () => {
        const stack = new RouterHistoryStack();
        stack.push("/fixtures?focus=sbr");

        expect(stack.peek()).toEqual("/fixtures?focus=sbr");

        stack.push("/fixtures?focus=sbr");
        stack.push("/fixtures?focus=sbr");
        stack.push("/fixtures?focus=sbr");
        stack.push("/fixtures?focus=sbr");
        stack.hardPop();

        expect(stack.peek()).toBeUndefined();
    });

    test("test soft popping to router stack ", () => {
        const stack = new RouterHistoryStack();
        stack.push("/fixtures?focus=sbr");
        stack.push("/fixtures?focus=pro");

        stack.softPop();
        expect(stack.peek()).toEqual("/fixtures?focus=sbr");

        stack.softPop();
        expect(stack.peek()).toEqual("/fixtures");

        stack.softPop();
        expect(stack.peek()).toBeUndefined();
    });

    test("test hard popping on router stack", () => {
        const stack = new RouterHistoryStack();
        stack.push("/dashboard");
        stack.push("/dashboard?league=urc");

        stack.push("/fixtures");
        stack.push("/fixtures?focus=sbr");
        stack.push("/fixtures?focus=pro");

        stack.push("/fixtures?player=player_1234");
        stack.push("/fixtures?team=team_12344");

        stack.hardPop();
        expect(stack.peek()).toEqual("/dashboard?league=urc");

        stack.hardPop();
        expect(stack.peek()).toBeUndefined();
    });

    test("test soft popping when one query param is there", () => {
        const stack = new RouterHistoryStack();
        stack.push("/leagues");
        stack.push("/leagues?id=urc");

        stack.softPop();
        expect(stack.peek()).toEqual("/leagues");

        stack.softPop();
        expect(stack.peek()).toBeUndefined();
    });
})