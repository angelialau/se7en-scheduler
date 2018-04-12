from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time, pickle, random

preButtonError = "submit button should be disabled before form is filled"
postButtonError = "submit button should be enabled after form is filled"
formResetError = "form input fields did not revert to ng-pristine after refreshing "

class FormsInstructorTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        # login
        self.driver.implicitly_wait(10)
        self.driver.get("http://localhost:4200/login")
    
        email = self.driver.find_element_by_id("email")
        email.send_keys("oka_kurniawan@sutd.edu.sg")

        password = self.driver.find_element_by_id("password")
        password.send_keys("password")

        button = self.driver.find_element_by_tag_name("button").click() 
        header = WebDriverWait(self.driver,10).until(
            EC.visibility_of_element_located((By.ID, 'logoutButton')))    

    def test_add_appeal(self):
        driver = self.driver
        driver.get("http://localhost:4200/viewschedule")

        appealFormButton = driver.find_elements_by_id("appealButton")
        self.assertEqual(len(appealFormButton), 1)
        appealFormButton[0].click()

        submit = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID, "makeAppealButton")))
        self.assertEqual(submit.is_enabled(), False, preButtonError)

        title = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID, "title")))
        title.send_keys(''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)]))

        content = driver.find_element_by_id("appealContent")
        content.send_keys(''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)]))

        submit = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "makeAppealButton")))
        self.assertEqual(submit.is_enabled(), True, postButtonError)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()