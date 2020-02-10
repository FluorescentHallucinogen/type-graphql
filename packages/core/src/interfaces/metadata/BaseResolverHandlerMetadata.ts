import { TypeMetadata } from "@src/interfaces/metadata/common";
import RawBaseResolverHandlerMetadata from "@src/metadata/storage/definitions/BaseResolverHandlerMetadata";
import ResolverHandlerParametersMetadata from "@src/interfaces/metadata/ResolverHandlerParametersMetadata";

export default interface BaseResolverHandlerMetadata
  extends RawBaseResolverHandlerMetadata,
    TypeMetadata,
    ResolverHandlerParametersMetadata {}
