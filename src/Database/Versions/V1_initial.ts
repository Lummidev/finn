import type { DatabaseVersion } from ".";

const version: DatabaseVersion = {
  stores: {
    categories: "id, &name, precedence",
    entries: "id, createdAtTimestampMiliseconds, categoryID",
    messages: "id, createdAtTimestampMiliseconds",
  },
};

export default version;
