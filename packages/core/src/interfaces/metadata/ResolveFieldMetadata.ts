import RawResolveFieldMetadata from "@src/metadata/storage/definitions/FieldResolverMetadata";
import ResolverHandlerParametersMetadata from "@src/interfaces/metadata/ResolverHandlerParametersMetadata";

export default interface ResolveFieldMetadata
  extends RawResolveFieldMetadata,
    ResolverHandlerParametersMetadata {}
