import { TypeMetadata } from "@src/interfaces/metadata/common";
import ParameterMetadata from "@src/interfaces/metadata/parameters/ParameterMetadata";
import RawBaseResolverHandlerMetadata from "@src/metadata/storage/definitions/BaseResolverHandlerMetadata";

export default interface BaseResolverHandlerMetadata
  extends RawBaseResolverHandlerMetadata,
    TypeMetadata {
  readonly parameters: readonly ParameterMetadata[];
}
