import 'package:flutter/material.dart';
import 'package:customer_service/core/icons/prbal_icons.dart';

class FooterWidget extends StatelessWidget {
  const FooterWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 25, vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Text(
                "OpenAI © 2015–2022",
                style: TextStyle(
                  fontSize: 18,
                ),
              ),
              Text(
                " Privacy Policy",
                style: TextStyle(
                  fontSize: 18,
                ),
              ),
              Text(
                " Terms of Use",
                style: TextStyle(
                  fontSize: 18,
                ),
              ),
            ],
          ),
          Row(
            children: [
              Icon(Prbal.twitter, size: 20),
              SizedBox(
                width: 30,
              ),
              Icon(
                Prbal.youtubePlay,
                size: 20,
              ),
              SizedBox(
                width: 30,
              ),
              Icon(
                Prbal.github,
                size: 20,
              ),
              SizedBox(
                width: 30,
              ),
              Icon(
                Prbal.facebook,
                size: 20,
              ),
              SizedBox(
                width: 30,
              ),
              Icon(Prbal.linkedin, size: 20),
              SizedBox(
                width: 30,
              ),
              Icon(Prbal.instagram, size: 20),
              SizedBox(
                width: 30,
              ),
            ],
          )
        ],
      ),
    );
  }
}
