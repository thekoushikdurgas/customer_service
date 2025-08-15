import 'package:flutter/material.dart';
import 'package:customer_service/features/global/theme/style.dart';
import 'package:customer_service/core/icons/prbal_icons.dart';
import 'package:customer_service/res/assets_res.dart';
import 'package:lottie/lottie.dart';

class CustomTextField extends StatelessWidget {
  final TextEditingController textEditingController;
  final VoidCallback? onTap;
  final bool isRequestProcessing;
  const CustomTextField({
    super.key,
    required this.textEditingController,
    this.onTap,
    required this.isRequestProcessing,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 28, left: 150, right: 150),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                color: colorDarkGray,
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          constraints: BoxConstraints(maxHeight: 90),
                          child: TextField(
                            style: TextStyle(fontSize: 14),
                            controller: textEditingController,
                            decoration: InputDecoration(
                              hintText: "Open AI prompt",
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 10),
                      isRequestProcessing == true
                          ? SizedBox(
                              height: 40,
                              child: Lottie.asset(
                                AssetsRes.LOADING_ANIMATION,
                                height: 40,
                                width: 40,
                                fit: BoxFit.contain,
                              ),
                            )
                          : InkWell(
                              onTap: textEditingController.text.isEmpty
                                  ? null
                                  : onTap,
                              child: Icon(
                                Prbal.send,
                                color: textEditingController.text.isEmpty
                                    ? Colors.grey.withValues(alpha: .4)
                                    : Colors.grey,
                              ),
                            ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
