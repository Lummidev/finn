import { createContext } from "react";
import type { Message } from "../Entities/Message";

export const MessageContext = createContext<Message[]>([]);
