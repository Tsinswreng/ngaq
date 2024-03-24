import * as Word from "@shared/entities/Word/Word";
import { WordDbRow } from "@shared/DbRow/Word";
export default Word.Word
const Priority = Word.Priority
type  Priority = Word.Priority

const Tempus_Event = Word.Tempus_Event
type  Tempus_Event = Word.Tempus_Event

const WordEvent = Word.WordEvent
type  WordEvent = Word.WordEvent

type IVocaRow = WordDbRow

export {Priority, Tempus_Event, WordEvent, WordDbRow as VocaDbTable, IVocaRow}
