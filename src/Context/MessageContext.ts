import { createContext } from "react";
import type { JoinedMessage } from "../Database/MessageRepository";

export const MessageContext = createContext<JoinedMessage[]>([]);
