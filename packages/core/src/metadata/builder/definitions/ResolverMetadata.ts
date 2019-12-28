import ResolverMetadata from "@src/metadata/storage/definitions/ResolverMetadata";
import BuiltQueryMetadata from "@src/metadata/builder/definitions/QueryMetadata";

export default interface BuiltResolverMetadata extends ResolverMetadata {
  queries: BuiltQueryMetadata[];
}
