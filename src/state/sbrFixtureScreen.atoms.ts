import { atom } from "jotai";
import { ISbrFixtureEvent, ISbrBoxscoreItem, ISbrFixture } from "../types/sbr";

export const sbrFixtureAtom = atom<ISbrFixture>();

/** Holds an array of sbr fixture events */
export const sbrFixtureEventsAtom = atom<ISbrFixtureEvent[]>([]);

/** Holds an array of boxscore items for an sbr fixture */
export const sbrFixtureBoxscoreAtom = atom<ISbrBoxscoreItem[]>([])