import 'package:customer_service/features/chat/domain/entities/chat_converstaion_entity.dart';
import 'package:customer_service/features/chat/domain/repositories/chat_repository.dart';

class ChatConversationUseCase {
  final ChatRepository repository;

  ChatConversationUseCase({required this.repository});

  Future<ChatConversationEntity> call(
    String prompt,
    Function(bool isReqComplete) onCompleteReqProcessing,
  ) {
    return repository.chatConversation(prompt, onCompleteReqProcessing);
  }
}
