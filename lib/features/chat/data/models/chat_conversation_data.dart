import 'package:customer_service/features/chat/domain/entities/chat_conversation_data_entity.dart';

class ChatConversationData extends ChatConversationDataEntity {
  const ChatConversationData({super.text, super.finishReason, super.index});

  factory ChatConversationData.fromJson(Map<String, dynamic> json) {
    return ChatConversationData(
      text: json['text'],
      index: json['index'],
      finishReason: json['finishReason'],
    );
  }
}
