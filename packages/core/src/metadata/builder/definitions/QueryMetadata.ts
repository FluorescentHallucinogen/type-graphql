import QueryMetadata from "@src/metadata/storage/definitions/QueryMetadata";
import { BuiltTypeMetadata } from "@src/metadata/builder/definitions/common";

export default interface BuiltQueryMetadata
  extends QueryMetadata,
    BuiltTypeMetadata {}
