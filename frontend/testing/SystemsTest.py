from formsCoordinatorTest.py import FormsCoordinatorTest
from formsInstructorTest import FormsInstructorTest
from navigationCoordinatorTest import NaviTest as nct 
from navigationInstructorTest import NaviTest as nit 
from loginTest import LoginTest
from robustnessTest import RobustnessTest
import unittest

def suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(FormsCoordinatorTest))    
    suite.addTest(unittest.makeSuite(FormsInstructorTest))    
    suite.addTest(unittest.makeSuite(nct))    
    suite.addTest(unittest.makeSuite(nit))    
    suite.addTest(unittest.makeSuite(LoginTest))    
    suite.addTest(unittest.makeSuite(RobustnessTest))    
    return suite

runner = unittest.TextTestRunner()
runner.run(suite())