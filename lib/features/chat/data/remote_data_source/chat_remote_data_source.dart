import 'package:customer_service/features/chat/domain/entities/chat_converstaion_entity.dart';

abstract class ChatRemoteDataSource {
  Future<ChatConversationEntity> chatConversation(
    String prompt,
    Function(bool isReqComplete) onCompleteReqProcessing,
  );
}
