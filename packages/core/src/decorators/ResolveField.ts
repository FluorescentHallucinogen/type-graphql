import TypedMethodDecorator from "@src/interfaces/TypedMethodDecorator";
import RawMetadataStorage from "@src/metadata/storage/RawMetadataStorage";
import ClassType from "@src/interfaces/ClassType";
import PickTypePropertyFn from "@src/interfaces/PickTypePropertyFn";
import { getPropertyAccessProxy } from "@src/decorators/helpers";

/**
 * Decorator used to register the class method
 * as a resolver function of object type field in GraphQL schema
 */
export default function ResolveField<TClassType extends ClassType>(
  typeClassFn: (of: void) => TClassType,
  pickTypePropertyFn: PickTypePropertyFn<TClassType>,
): TypedMethodDecorator {
  return (prototype, resolverPropertyKey) => {
    const resolverClass = prototype.constructor as ClassType; // FIXME: fix typed decorator signature
    // TODO: what if typeClass is not ObjectType class?
    const typeClass = typeClassFn();
    const typePropertyKey = pickTypePropertyFn(getPropertyAccessProxy());
    RawMetadataStorage.get().collectResolveFieldMetadata({
      targetClass: typeClass,
      propertyKey: typePropertyKey,
      resolverClass,
      resolverPropertyKey,
    });
  };
}
