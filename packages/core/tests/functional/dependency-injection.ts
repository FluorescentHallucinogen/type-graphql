import "reflect-metadata";
import { execute } from "graphql";
import gql from "graphql-tag";
import Container from "typedi";

import { Query, Resolver, buildSchema, ContainerType } from "@typegraphql/core";

describe("Dependency Injection", () => {
  it("should use default container to get single instance of resolver class for each call", async () => {
    const initValue = Math.random();
    @Resolver()
    class SampleResolver {
      private readonly constValue = initValue;
      @Query()
      sampleQuery(): number {
        return this.constValue;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const schema = await buildSchema({ resolvers: [SampleResolver] });

    const firstResult = await execute({ schema, document });
    const secondResult = await execute({ schema, document });

    expect(firstResult.errors).toBeUndefined();
    expect(secondResult.errors).toBeUndefined();
    expect(firstResult.data?.sampleQuery).toEqual(initValue);
    expect(secondResult.data?.sampleQuery).toEqual(initValue);
  });

  it("should use provided container to get instance of resolver class", async () => {
    const initValue = Math.random();
    class SampleService {
      readonly value = initValue;
    }
    @Resolver()
    class SampleResolver {
      constructor(private readonly sampleService: SampleService) {}
      @Query()
      sampleQuery(): number {
        return this.sampleService.value;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const schema = await buildSchema({
      resolvers: [SampleResolver],
      container: Container,
    });

    const { data, errors } = await execute({ schema, document });

    expect(errors).toBeUndefined();
    expect(data?.sampleQuery).toEqual(initValue);
  });

  it("should use container from container getter function called with resolve data", async () => {
    interface TestContext {
      container: ContainerType;
    }
    @Resolver()
    class SampleResolver {
      @Query()
      sampleQuery(): string {
        return "sampleQuery";
      }
    }
    const schema = await buildSchema<TestContext>({
      resolvers: [SampleResolver],
      container: ({ context }) => context.container,
    });
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const wrapperContainer: ContainerType = {
      get: jest.fn(someClass => Container.get(someClass)),
    };
    const contextValue: TestContext = {
      container: wrapperContainer,
    };

    const { data, errors } = await execute({ schema, document, contextValue });

    expect(errors).toBeUndefined();
    expect(data?.sampleQuery).toEqual("sampleQuery");
    expect(wrapperContainer.get).toHaveBeenCalledTimes(1);
    expect(wrapperContainer.get).toHaveBeenCalledWith(SampleResolver, {
      source: undefined,
      args: {},
      context: contextValue,
      info: expect.any(Object),
    });
  });

  it("should await for async container while getting instance of resolver class", async () => {
    const initValue = Math.random();
    class SampleService {
      readonly value = initValue;
    }
    @Resolver()
    class SampleResolver {
      constructor(private readonly sampleService: SampleService) {}
      @Query()
      sampleQuery(): number {
        return this.sampleService.value;
      }
    }
    const document = gql`
      query {
        sampleQuery
      }
    `;
    const asyncContainer: ContainerType = {
      async get(cls) {
        return Promise.resolve(Container.get(cls));
      },
    };
    const schema = await buildSchema({
      resolvers: [SampleResolver],
      container: asyncContainer,
    });

    const { data, errors } = await execute({ schema, document });

    expect(errors).toBeUndefined();
    expect(data?.sampleQuery).toEqual(initValue);
  });
});
