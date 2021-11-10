import CreateSubscriberDto from './dto/create-subscriber.dto';

export interface Subscriber {
  id: number;
  email: string;
  name: string;
}

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  getAllSubscribers(
    params: Record<string, unknown>,
  ): Promise<{ data: Subscriber[] }>;
}

export default SubscribersService;
