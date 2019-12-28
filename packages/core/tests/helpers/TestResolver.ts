import { Query, Resolver } from "@typegraphql/core";

@Resolver()
export default class TestResolver {
  @Query(_returns => String)
  hello(): string {
    return "Hello World";
  }
}
