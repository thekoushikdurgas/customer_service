import 'package:equatable/equatable.dart';

class ChatConversationDataEntity extends Equatable {
  final String? text;
  final num? index;
  final String? finishReason;

  const ChatConversationDataEntity({this.text, this.index, this.finishReason});

  @override
  // TODO: implement props
  List<Object?> get props => [text, index, finishReason];
}
