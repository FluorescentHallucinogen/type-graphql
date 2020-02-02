import ParamKind from "@src/interfaces/ParamKind";
import RawBaseParameterMetadata from "@src/metadata/storage/definitions/parameters/BaseParameterMetadata";

export default interface RawStandardParameterMetadata
  extends RawBaseParameterMetadata {
  readonly kind: ParamKind.Standard;
}
