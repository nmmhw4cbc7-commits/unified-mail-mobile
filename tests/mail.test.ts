import { describe, expect, it } from "vitest";
import { accounts, messages, getAccount } from "../lib/mail-data";
import { validateComposeFields } from "../lib/compose-utils";

describe("Unified Mail data", () => {
  it("contains mail connected to a known account", () => {
    expect(messages.length).toBeGreaterThan(0);
    expect(messages.every((mail) => accounts.some((account) => account.id === mail.accountId))).toBe(true);
  });

  it("filters mails by account and search text", () => {
    const result = messages.filter((mail) => mail.accountId === "work" && `${mail.senderName} ${mail.subject}`.toLowerCase().includes("launch"));
    expect(result).toHaveLength(1);
    expect(result[0].subject).toContain("Launch");
  });

  it("resolves a fallback account for unknown ids", () => {
    expect(getAccount("missing").id).toBe(accounts[0].id);
  });

  it("requires all compose fields before sending", () => {
    expect(validateComposeFields("person@example.com", "Hallo", "Nachricht")).toBe(true);
    expect(validateComposeFields("person@example.com", "", "Nachricht")).toBe(false);
  });
});
