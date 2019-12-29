import TypedClassDecorator from "@src/interfaces/TypedClassDecorator";
import MetadataStorage from "@src/metadata/storage/MetadataStorage";

/**
 * Decorator used to register the class as resolver class
 * which is grouping queries, mutation and subscription handlers
 */
export default function Resolver(): TypedClassDecorator {
  return target => {
    MetadataStorage.get().collectResolverMetadata({
      target,
    });
  };
}
