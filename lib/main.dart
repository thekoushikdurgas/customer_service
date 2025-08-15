import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:customer_service/core/http_certificate_manager.dart';
import 'package:customer_service/features/app/home/home_page.dart';
import 'package:customer_service/features/app/route/on_generate_route.dart';
import 'package:customer_service/features/chat/presentation/cubit/chat_conversation/chat_conversation_cubit.dart';
import 'injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = MyHttpOverrides();
  await di.init();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => di.sl<ChatConversationCubit>(),
      child: MaterialApp(
        title: 'ChatGpt Clone',
        theme: ThemeData(brightness: Brightness.dark),
        initialRoute: '/',
        debugShowCheckedModeBanner: false,
        onGenerateRoute: OnGenerateRoute.route,
        routes: {
          "/": (context) {
            return HomePage();
          },

          // add dark and light theme.
          // chatMessages history
        },
      ),
    );
  }
}
