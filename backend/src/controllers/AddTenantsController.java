package backend.repository;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URLEncoder;

@Controller
public class AddTenantsController{
    @Autowired

    @GetMapping()
    public String AddTenant(
    @RequestParam("id") int userid,  
    @RequestParam("first_name") String first_name,
    @RequestParam("last_name") String last_name,
    @RequestParam("unit") char unit,
    @RequestParam("email") String email,
    @RequestParam("phone_number") String number) {

        Tenant tenant = new Tenant();

        tenant.setId(userid);
        tenant.setFirstName(first_name);
        tenant.setLastName(last_name);
        tenant.setEmail(email);
        tenant.setUnit(unit);
        tenant.setPhoneNumber(number);

        try {
            TenantsRepository.add(tenant);

        } catch(ErrorException e) {
            return "redirect:/error.html?errorMessage=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
        }
        
        return "redirect:/success.html?firstname=" + URLEncoder.encode(userid, StandardCharsets.UTF_8);
    }
}