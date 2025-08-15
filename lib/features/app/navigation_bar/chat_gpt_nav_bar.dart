import 'package:flutter/material.dart';
import 'package:customer_service/features/app/navigation_bar/nav_button.dart';
import 'package:customer_service/features/global/theme/style.dart';

class ChatGptNavBar extends StatelessWidget {
  const ChatGptNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(top: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(
            height: 70,
            child: Image.asset("assets/icon/icon.png", color: colorPink),
          ),
          Row(
            children: [
              NavButton(
                title: "APIS",
                onTap: () {
                  //TODO:
                },
              ),
              SizedBox(width: 25),
              NavButton(title: "RESEARCH", onTap: () {}),
              SizedBox(width: 25),
              NavButton(
                  title: "BLOG", textColor: colorPink.withValues(alpha: .4)),
              SizedBox(width: 25),
              NavButton(title: "ABOUT", onTap: () {}),
            ],
          ),
        ],
      ),
    );
  }
}
