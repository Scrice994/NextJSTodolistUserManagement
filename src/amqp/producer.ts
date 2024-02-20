import amqp from "amqplib";
import env from "../env";

export class Producer {
    private channel: amqp.Channel;

    private async createChannel(){
        const connection = await amqp.connect(env.RABBITMQ_URL);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey: string, eventType: string, event: any){
        if(!this.channel){
            await this.createChannel();
        }

        const exchangeName = "userEventExchange";
        await this.channel.assertExchange(exchangeName, "direct");

        const eventDetails = {
            eventType,
            event,
            dateTime: new Date()
        }

        this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(eventDetails))
        );

        console.log("An event as been send to: " + exchangeName);
    }
}