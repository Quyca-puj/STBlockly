package com.smartown.server.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.STActionParameter;
import com.smartown.server.model.STActionParameterBundle;
import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.repository.STActionParameterBundleRepository;
import com.smartown.server.model.repository.STActionParametersRepository;
import com.smartown.server.model.repository.STBaseActionRepository;

@Service
public class STBaseActionService implements ISTBaseActionService {

	@Autowired
	private STBaseActionRepository repository;
	@Autowired
	private STActionParameterBundleRepository bundleRepository;
	@Autowired
	private STActionParametersRepository paramsRepository;

	@Override
	public List<STBaseAction> getAllBaseActions() {
		List<STBaseAction> list = (List<STBaseAction>) repository.findAll();
		if (list.size() > 0) {
			return list;
		}
		return null;
	}

	@Override
	public STBaseAction createBaseAction(STBaseAction command) {
		Optional<STBaseAction> possibleCommand = repository.findByName(command.getName());
		if (possibleCommand.isPresent()) {
			STBaseAction previous = possibleCommand.get();
			command.setId(previous.getId());
		}

		List<STActionParameterBundle> bundleList = new ArrayList<>();
		STActionParameter param = paramsRepository.findByName("speed");
		STActionParameterBundle bundle = new STActionParameterBundle();
		bundle.setParameter(param);
		bundle.setPosition(0);
		bundle.setTranslatedName("Velocidad");
		bundle = bundleRepository.save(bundle);
		bundleList.add(bundle);
		command.setParams(bundleList);
		command.setTranslatedName(command.getName());
		command.setCustom(true);
		command.setUsesArgs(true);
		command.setShouldAnswer(true);
		return repository.save(command);
	}

	@Override
	public List<STBaseAction> getAllCustomBaseActions() {
		List<STBaseAction> list = (List<STBaseAction>) repository.findAllByCustom(true);
		if (list.size() > 0) {
			return list;
		}
		return null;
	}

	@Override
	public List<STBaseAction> getAllFixedBaseActions() {
		List<STBaseAction> list = (List<STBaseAction>) repository.findAllByCustom(false);
		if (list.size() > 0) {
			return list;
		}
		return null;
	}

	@Override
	public STBaseAction getBaseActionFromName(String name) {
		System.out.println("BASEACTION: " + name);
		STBaseAction action = repository.findByName(name).get();
		return action;
	}

}
