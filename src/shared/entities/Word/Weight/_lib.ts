import Tempus from "@shared/Tempus";
import { Word } from "../Word";
import { Sros } from "@shared/Sros";

export const weightLib = {
	Word: class _Word extends Word{}
	,Tempus: class _Tempus extends Tempus{}
	,Sros: class _Sros extends Sros{}
}

