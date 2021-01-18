package org.westernacher.solutions.service;

import org.springframework.http.ResponseEntity;
import org.westernacher.solutions.domain.entities.SavedJob;
import org.westernacher.solutions.domain.models.binding.SavedOrderBindingModel;
import org.westernacher.solutions.domain.models.binding.UserEditBindingModel;
import org.westernacher.solutions.domain.models.service.UserServiceModel;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Set;

public interface UserService extends UserDetailsService {

    boolean createUser(UserServiceModel userServiceModel);
    boolean editUser(UserEditBindingModel userEditBindingModel);
    boolean deleteUser(String username);
    Set<UserServiceModel> getAll();
    boolean promoteUser(String id);
    boolean demoteUser(String id);
    String getUserAuthority(String userId);
    List<SavedJob> getUserCart(String username);
    ResponseEntity saveOrder(SavedOrderBindingModel savedOrderBindingModel);
    ResponseEntity removeSavedOrder(String id);
}
