import { describe, expect, it } from "vitest";
import { accounts, messages, getAccount } from "../lib/mail-data";
import { validateComposeFields } from "../lib/compose-utils";

describe("Unified Mail user data", () => {
  it("starts without hardcoded accounts or messages", () => {
    expect(accounts).toEqual([]);
    expect(messages).toEqual([]);
  });

  it("does not invent an account for unknown ids", () => {
    expect(getAccount("missing")).toBeUndefined();
  });

  it("keeps search results empty until the user connects a mailbox", () => {
    const result = messages.filter((mail) => `${mail.senderName} ${mail.subject}`.toLowerCase().includes("launch"));
    expect(result).toEqual([]);
  });

  it("requires all compose fields before sending", () => {
    expect(validateComposeFields("person@example.com", "Hallo", "Nachricht")).toBe(true);
    expect(validateComposeFields("person@example.com", "", "Nachricht")).toBe(false);
  });
});
