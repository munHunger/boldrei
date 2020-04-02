import {
  ObjectType,
  Field,
  Query,
  Mutation,
  InputType,
  Arg,
  PubSub,
  Publisher,
  Subscription,
  Root
} from "type-graphql";

let messages: Message[] = [];

@ObjectType()
@InputType("MessageInput")
export class Message {
  @Field()
  topic: string;

  @Field()
  json: string;
}

export class MessageResolver {
  @Query(() => [Message])
  async messages(): Promise<Message[]> {
    return messages;
  }

  @Mutation(() => String)
  pushMessage(
    @Arg("message") message: Message,
    @PubSub("NEW_MESSAGE") publish: Publisher<Message>
  ) {
    messages.push(message);
    messages = messages.slice(-100);
    publish(message);
    return "OK";
  }

  @Subscription({
    topics: "NEW_MESSAGE",
    filter: ({ payload, args }) => args.topic === payload.topic
  })
  newMessage(@Root() message: Message, @Arg("topic") _args: String): Message {
    return message;
  }
}
