# -*- coding: utf-8 -*-
"""Collection of actions sent to robot through the ardublocklyserver for relieved HTTP requests.

Copyright (c) 2017 carlosperate https://github.com/carlosperate/
Licensed under the Apache License, Version 2.0 (the "License"):
    http://www.apache.org/licenses/LICENSE-2.0
"""
from __future__ import unicode_literals, absolute_import, print_function


def send_code_to_robot(robot_action, socket_mgmt):
    """
    """
    ret = True
    ip = robot_action['ip']
    if "emomsg" in robot_action:
        print(robot_action['emomsg'], "emotionText")
        socket_mgmt.send_msg(ip,robot_action['emomsg'])
    if "msg" in robot_action:
        ret = socket_mgmt.send_msg(ip,robot_action['msg'],robot_action['ack'])
    return ret



