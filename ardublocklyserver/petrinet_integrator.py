from py4j.java_collections import MapConverter

def send_petri_net(charac_info,petriNet, gateway):
    """Sends petrinet object and character information through Py4J getaway"""
    success = True
    ide_mode = 'unknown'
    std_out, err_out = '', ''
    exit_code = 0
    try:

        print("Entra send_petri_net")
        print("charac_info",charac_info)
        print("petriNet",petriNet)
        success = gateway.entry_point.runPetriNetFromStrings(str(charac_info), str(petriNet))
    except Exception:
        success = False
        exit_code = 201
        err_out = 'No fue posible iniciar la obra.'
    return success, ide_mode, std_out, err_out, exit_code

def pause_petri_net(gateway):
    """Sends petrinet pause request through Py4J getaway"""
    success = True
    ide_mode = 'unknown'
    std_out, err_out = '', ''
    exit_code = 0
    try:
        success = gateway.entry_point.pauseNet()
    except Exception:
        success = False
        exit_code = 202
        err_out = 'No fue posible pausar la obra.'
    return success, ide_mode, std_out, err_out, exit_code


def stop_petri_net(gateway):
    """Sends petrinet stop request through Py4J getaway"""
    success = True
    ide_mode = 'unknown'
    std_out, err_out = '', ''
    exit_code = 0
    try:
        success = gateway.entry_point.stopNet()
    except Exception:
        success = False
        exit_code = 203
        err_out = 'No fue posible detener la obra.'
    return success, ide_mode, std_out, err_out, exit_code

def resume_petri_net(gateway):
    """Sends petrinet resume request through Py4J getaway"""
    success = True
    ide_mode = 'unknown'
    std_out, err_out = '', ''
    exit_code = 0
    try:
        success = gateway.entry_point.resumeNet()
    except Exception:
        success = False
        exit_code = 204
        err_out = 'No fue posible iniciar de nuevo la obra.'
    return success, ide_mode, std_out, err_out, exit_code
