import 'package:flutter/material.dart';
import 'package:customer_service/features/global/theme/style.dart';

class NavButton extends StatelessWidget {
  final String title;
  final VoidCallback? onTap;
  final Color? textColor;

  const NavButton({super.key, required this.title, this.onTap, this.textColor});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textColor ?? colorPink,
        ),
      ),
    );
  }
}
